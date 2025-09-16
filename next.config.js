/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  env: {
    SGIS_SERVICE_ID: process.env.SGIS_SERVICE_ID,
    SGIS_SECURITY_KEY: process.env.SGIS_SECURITY_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
};

module.exports = nextConfig;