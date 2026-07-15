/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Avoid Vercel Image Optimization quota (free tier: 5,000 transformations/month).
    // Images still load via next/image (lazy load, sizing) — served as original files.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xbjyrfrwtewnisehkjaz.supabase.co",
      },
    ],
  },
};

export default nextConfig;
