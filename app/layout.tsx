import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mahjongmultiplayer.com'),
  title: 'Mahjong Multiplayer - Play Mahjong with Friends Online for Free',
  description: 'Play Mahjong online with friends for free. Hong Kong and American rules, practice vs bots, and persistent friend tables.',
  openGraph: {
    title: 'Mahjong Multiplayer',
    description: 'Play Mahjong with friends, online for free',
    url: 'https://mahjongmultiplayer.com',
    siteName: 'Mahjong Multiplayer',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Mahjong Multiplayer - Play with friends online',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahjong Multiplayer',
    description: 'Play Mahjong with friends, online for free',
    images: ['/api/og'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
