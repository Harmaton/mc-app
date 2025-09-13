import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // ← UploadThing's CDN domain
        port: '',
        pathname: '/f/**', // Allows any file path under /f/
      },
       {
        protocol: 'https',
        hostname: '6ivlwjpezy.ufs.sh',
        port: '',
        pathname: '/f/**', // Allows any path under /f/
      },
    ],
  },
};

export default nextConfig;
