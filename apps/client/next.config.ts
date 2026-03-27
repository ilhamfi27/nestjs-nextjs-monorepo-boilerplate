import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Set NEXT_OUTPUT=standalone when building inside Docker for an optimized image.
  // Leave unset for local development and standard builds.
  output: (process.env.NEXT_OUTPUT as NextConfig['output']) ?? undefined,
};

export default nextConfig;
