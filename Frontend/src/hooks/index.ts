/**
 * Re-export all hooks from their respective domains
 * This allows for cleaner imports in components:
 * import { useOrganization, useCreateJob } from '@hooks';
 */

// Re-export hooks from each domain
export * from "./organization";
// Uncomment these exports after moving the files to their respective directories
// export * from './job';
// export * from './milestone';
// export * from './worker';
// export * from './finance';
// export * from './auth';
// export * from './common';

// Keep the faucet exports since they're already properly organized
export * from "./faucet";
