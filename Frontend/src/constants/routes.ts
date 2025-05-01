/**
 * Application routes centralized in one location
 * This makes it easier to maintain and update routes across the application
 */

export const ROUTES = {
  // Main pages
  HOME: "/",
  FEATURES: "/features",
  HOW_IT_WORKS: "/howitworks",
  CLIENT: "/clientpage",
  SERVICE_PROVIDER: "/providerspage",
  FAUCET: "/faucet",

  // Future routes can be added here
  // PROFILE: '/profile',
  // SETTINGS: '/settings',
};

// Named route helper function
export const getRoute = (routeName: keyof typeof ROUTES) => ROUTES[routeName];
