import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  
  // Agregamos las reescrituras
  async rewrites() {
    return [
      {
        source: "/api/recognize_face", // Ruta en tu frontend
        destination: "http://85.31.225.19/api/recognize_face", // Ruta en tu backend
      },
    ];
  },
};

export default nextConfig;
