const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @param {string} phase @returns {import('next').NextConfig} */
module.exports = (phase) => ({
  reactStrictMode: true,
  // Keep dev font/CSS artifacts separate from the optimized production build.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
