import type { NextConfig } from "next";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

// Validate env at build time
jiti("./src/env.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
