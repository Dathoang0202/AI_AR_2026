const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const path = require('path');

/** @param {string} phase @returns {import('next').NextConfig} */
module.exports = (phase) => ({
  reactStrictMode: true,
  output: 'export',
  ...(process.env.GITHUB_PAGES === 'true' ? {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/AI_AR_2026',
    trailingSlash: true,
  } : {}),
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  // Keep dev font/CSS artifacts separate from the optimized production build.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
