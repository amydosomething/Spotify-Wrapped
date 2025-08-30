/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'lineup-images.scdn.co']
  },
};

module.exports = nextConfig;