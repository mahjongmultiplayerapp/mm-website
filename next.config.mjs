import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const hongKongLearnSections = [
  'what-is-hong-kong-mahjong',
  'tiles-melds-winning-hands',
  'setup-and-dealing',
  'turn-flow-and-discarding',
  'calls-chow-pung-kong-win',
  'scoring-and-fan',
  'rounds-draws-table-rules',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      ...hongKongLearnSections.flatMap((sectionSlug) => [
        {
          source: `/learn/${sectionSlug}`,
          destination: `/learn/hong-kong/${sectionSlug}`,
          permanent: true,
        },
        {
          source: `/learn/${sectionSlug}/:lessonSlug`,
          destination: `/learn/hong-kong/${sectionSlug}/:lessonSlug`,
          permanent: true,
        },
      ]),
      {
        source: '/learn/final-readiness-test',
        destination: '/learn/hong-kong/final-readiness-test',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
