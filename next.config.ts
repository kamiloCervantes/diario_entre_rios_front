import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sin subida de imágenes: el admin pega una URL de cualquier sitio https.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
