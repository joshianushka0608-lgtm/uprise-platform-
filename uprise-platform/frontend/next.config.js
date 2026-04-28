/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.corntub.xyz'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://uprise-backend.up.railway.app/:path*',
      },
    ];
  },
};
module.exports = nextConfig;