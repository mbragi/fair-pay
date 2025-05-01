/**
 * Application configuration
 * Environment-specific settings and global configuration
 */

import { baseSepolia } from "thirdweb/chains";

// Blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  defaultChain: baseSepolia,
  supportedChains: [baseSepolia],
  // Add other blockchain-related configuration here
};

// API configuration
export const API_CONFIG = {
  blockscoutApiUrl: "https://base-sepolia.blockscout.com/api",
};

// Application configuration
export const APP_CONFIG = {
  appName: "FairPay",
  toastDuration: 5000, // Duration for toast notifications in ms
};
