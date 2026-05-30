import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The @xlumina/system package source uses NodeNext-style ".js" import
  // specifiers (required so the published dist works in raw Node ESM). When the
  // app consumes that TS source via path alias, webpack needs to know a ".js"
  // specifier may resolve to a ".ts"/".tsx" file.
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default nextConfig;
