export const APP_CONSTANTS = {
    APP: {
        NAME: 'EmoJud',
        VERSION: '1.0.0'
    },

    STORAGE_KEYS: {
        AUTH_TOKEN: 'emojud_access_token',
        USER_PROFILE: 'emojud_user',
        THEME: 'emojud_theme'
    },

    COOKIE: {
        TOKEN_MAX_AGE_SECONDS: 7 * 24 * 60 * 60
    },

    API: {
        TIMEOUT_MS: 30000
    },

    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10
    }
} as const;
