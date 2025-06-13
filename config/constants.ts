export const AUTH_CONFIG = {
    TOKEN_KEYS: {
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        USER: 'user',
    },
    AUTH_ENDPOINTS: {
        SIGNIN: '/auth/signin',
        SIGNUP: '/auth/signup',
        REFRESH: '/auth/refresh',
        EXCHANGE: '/auth/exchange',
        LOGOUT: '/api/auth/logout',
        USER_ME: '/api/v1/user/me',
    },
} as const;