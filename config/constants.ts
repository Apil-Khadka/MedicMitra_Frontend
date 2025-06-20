import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
    BACKEND_URL: "http://10.144.89.109:8080",
    API_VERSION: "v1",
    API_PREFIX: "/api",
} as const;

// Auth Configuration
export const AUTH_CONFIG = {
    TOKEN_KEYS: {
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        USER: 'user',
        LANGUAGE: 'language',
    },
    AUTH_ENDPOINTS: {
        SIGNIN: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/auth/signin`,
        SIGNUP: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/auth/signup`,
        REFRESH: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/refresh`,
        LOGOUT: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/logout`,
        USER_ME: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/me`,
        USER_UPDATE: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/update`,
        FETCH_ALL_TOPICS: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/topics/all`,
        FETCH_MEDICINES_BY_TOPIC: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/topic`,
        MEDICINE_DETAILS: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/details`,
        MEDICINE_SIDE_EFFECTS: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/sideEffect`,
        MEDICINE_BRAND_NAMES: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/brandName`,
        MEDICINE_GENERIC_NAMES: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/genericName`,
        MEDICINE_DOSAGE_FORMS: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/dosageForms`,
        MEDICINE_DISEASES: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/diseases`,
        MEDICINE_SEARCH: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/medicines/search`,
    },
} as const;

// OAuth Configuration
export const OAUTH_CONFIG = {
    REDIRECT_URI: {
        SCHEME: "toura",
        PATH: "auth/success",
    },
    PROVIDERS: {
        GOOGLE: '/oauth2/authorization/google',
        GITHUB: '/oauth2/authorization/github',
    },
} as const;

// Platform-specific configuration
export const PLATFORM_CONFIG = {
    IS_WEB: Platform.OS === 'web',
    IS_NATIVE: Platform.OS === 'android' || Platform.OS === 'ios',
} as const;
