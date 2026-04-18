import { createSign } from 'node:crypto';
import { NextResponse } from 'next/server';

const SHEET_TAB_NAME = 'emails-submits';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GOOGLE_TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function getRequiredEnv(name: 'GOOGLE_PRIVATE_KEY' | 'GOOGLE_CLIENT_EMAIL' | 'GOOGLE_SHEET_ID'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizePrivateKey(rawPrivateKey: string): string {
  const trimmed = rawPrivateKey.trim();

  const unwrapped =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  return unwrapped.replace(/\\n/g, '\n');
}

function parseSpreadsheetId(rawValue: string): string {
  const value = rawValue.trim();

  if (!value) {
    throw new Error('GOOGLE_SHEET_ID is empty');
  }

  const fromDocsUrl = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (fromDocsUrl?.[1]) {
    return fromDocsUrl[1];
  }

  const fromEditSuffix = value.match(/^([a-zA-Z0-9-_]+)\/edit(?:\?|$)/);
  if (fromEditSuffix?.[1]) {
    return fromEditSuffix[1];
  }

  const fromPlainId = value.match(/^([a-zA-Z0-9-_]+)$/);
  if (fromPlainId?.[1]) {
    return fromPlainId[1];
  }

  throw new Error('GOOGLE_SHEET_ID format is invalid');
}

function toBase64Url(value: string): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createSignedJwt(clientEmail: string, privateKey: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_AUDIENCE,
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKey).toString('base64url');

  return `${signingInput}.${signature}`;
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const assertion = createSignedJwt(clientEmail, privateKey);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion
  });

  const tokenResponse = await fetch(GOOGLE_TOKEN_AUDIENCE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to fetch Google access token: ${tokenResponse.status}`);
  }

  const tokenJson = (await tokenResponse.json()) as { access_token?: string };
  if (!tokenJson.access_token) {
    throw new Error('Google token response did not include an access token');
  }

  return tokenJson.access_token;
}

async function appendEmailRow(params: { spreadsheetId: string; accessToken: string; email: string }) {
  const { spreadsheetId, accessToken, email } = params;
  const appendResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_TAB_NAME}!A:B:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [[new Date().toISOString(), email]]
    })
  });

  if (!appendResponse.ok) {
    throw new Error(`Failed to append row to Google Sheet: ${appendResponse.status}`);
  }
}

function getGoogleConfig() {
  const privateKey = normalizePrivateKey(getRequiredEnv('GOOGLE_PRIVATE_KEY'));
  const clientEmail = getRequiredEnv('GOOGLE_CLIENT_EMAIL');
  const spreadsheetId = parseSpreadsheetId(getRequiredEnv('GOOGLE_SHEET_ID'));
  return { privateKey, clientEmail, spreadsheetId };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const { clientEmail, privateKey, spreadsheetId } = getGoogleConfig();
    const accessToken = await getAccessToken(clientEmail, privateKey);
    await appendEmailRow({ spreadsheetId, accessToken, email });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to append email signup', error);
    return NextResponse.json({ error: 'Unable to save your email right now. Please verify server configuration and try again.' }, { status: 500 });
  }
}
