/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/landing-page.html',
      },
    ];
  },
};

export default nextConfig;
