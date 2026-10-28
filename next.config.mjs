/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a verification build (NEXT_DIST_DIR=.next-verify) run next to
  // `npm run dev` without overwriting the dev server's `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    serverComponentsExternalPackages: ['mammoth'],
  },
};

export default nextConfig;
