import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Turbopack (default in Next.js 16)
  turbopack: {},

  // Server external packages for SSR compatibility - don't bundle these on server
  serverExternalPackages: [
    '@reown/appkit',
    '@reown/appkit-adapter-bitcoin',
    '@reown/appkit-core',
    '@reown/appkit-ui',
    '@reown/appkit-utils',
    '@reown/appkit-common',
    '@walletconnect/universal-provider',
  ],
};

export default nextConfig;
