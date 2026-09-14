/**
 * Application environment configuration
 */
export const ENV_CONFIG = {
  APP_NAME: 'EmoJud',
  APP_VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
