export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
  },

  linkedin: {
    authUrl: `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`,
    scopes: ["openid", "profile", "email", "w_member_social"],
  },

  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  enableApiLogging: import.meta.env.DEV,
} as const;

export const validateEnvironment = (): boolean => {
  const required: string[] = [];

  if (required.length > 0) {
    console.error("❌ Missing required environment variables:", required);
    return false;
  }

  return true;
};

export default config;
