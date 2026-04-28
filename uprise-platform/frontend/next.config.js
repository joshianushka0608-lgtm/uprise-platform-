/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.corntub.xyz'],
  },
};
module.exports = nextConfig;