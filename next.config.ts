import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  // ...(process.env.NODE_ENV === 'development' ? {
  //   webpack: (config) => {
  //     config.watchOptions = {
  //       poll: 1000,
  //       aggregateTimeout: 300,
  //     }
  //     return config
  //   },
  // } : {
  //   turbopack: {},
  // }),
  experimental: {
    serverActions: {
      bodySizeLimit: '1024mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/sz',
        destination: 'https://dzen.ru/id/6656f5f0b43adc61aeefeb25?share_to=link',
        permanent: false,
      },
    ]
  },
  serverExternalPackages: ['prettier'],
  allowedDevOrigins: ['include-romantic-weekly-staying.trycloudflare.com'],
};

export default nextConfig;
