const formatApiUrl = (url?: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
        return trimmed.replace(/\/+$/, '');
    }
    return `http://${trimmed}`.replace(/\/+$/, '');
};

export const ENV_CONFIG = {
    APP_NAME: 'EmoJud',
    APP_VERSION: '1.0.0',
    API_BASE_URL: formatApiUrl(import.meta.env.VITE_API_URL),
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD
} as const;

