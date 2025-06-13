import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, AUTH_CONFIG, PLATFORM_CONFIG } from '@/config/constants';

// Helper function to get token based on platform
async function getToken(key: string): Promise<string | null> {
    if (PLATFORM_CONFIG.IS_WEB) {
        return sessionStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
}

// Helper function to set token based on platform
async function setToken(key: string, value: string): Promise<void> {
    if (PLATFORM_CONFIG.IS_WEB) {
        sessionStorage.setItem(key, value);
        return;
    }
    await SecureStore.setItemAsync(key, value);
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const accessToken = await getToken(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN);

    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        ...options.headers,
    };

    // Only add API version prefix if the URL starts with /api/ and doesn't already include the version
    const apiUrl = url.startsWith(API_CONFIG.API_PREFIX) && !url.includes(`/api/${API_CONFIG.API_VERSION}/`)
        ? url.replace(API_CONFIG.API_PREFIX, `${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}`)
        : url;

    const response = await fetch(`${API_CONFIG.BACKEND_URL}${apiUrl}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = await getToken(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_CONFIG.BACKEND_URL}${AUTH_CONFIG.AUTH_ENDPOINTS.REFRESH}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });

                if (refreshResponse.ok) {
                    const { access_token, refresh_token } = await refreshResponse.json();
                    await setToken(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN, access_token);
                    await setToken(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN, refresh_token);

                    // Retry the original request with new token
                    return fetchWithAuth(url, options);
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }
        }
    }

    return response;
}