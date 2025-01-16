import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: undefined,
      allowedOrigins: undefined,
    },
  },
  images: {
    domains: ['jvieiwxqntcrksfucglb.supabase.co'], // Add your Supabase URL domain here
  },
};

export default nextConfig;
