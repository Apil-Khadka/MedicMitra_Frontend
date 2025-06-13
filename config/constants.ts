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
    },
    AUTH_ENDPOINTS: {
        SIGNIN: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/auth/signin`,
        SIGNUP: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/auth/signup`,
        REFRESH: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/refresh`,
        LOGOUT: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/logout`,
        USER_ME: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/me`,
        USER_UPDATE: `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}/user/update`,
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
