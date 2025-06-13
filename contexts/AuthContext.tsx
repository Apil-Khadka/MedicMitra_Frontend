import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { API_CONFIG, AUTH_CONFIG, OAUTH_CONFIG, PLATFORM_CONFIG } from '@/config/constants';
import { fetchWithAuth } from "@/utils/api";

// Register for web browser redirect
WebBrowser.maybeCompleteAuthSession();

// Platform-specific storage functions
const storage = {
    async setAccessToken(token: string) {
        if (PLATFORM_CONFIG.IS_WEB) {
            sessionStorage.setItem(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN, token);
        } else {
            try {
                await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN, token);
            } catch (error) {
                console.error('Error storing access token:', error);
            }
        }
    },

    async getAccessToken() {
        if (PLATFORM_CONFIG.IS_WEB) {
            return sessionStorage.getItem(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN);
        } else {
            try {
                return await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN);
            } catch (error) {
                console.error('Error getting access token:', error);
                return null;
            }
        }
    },

    async setRefreshToken(token: string) {
        if (PLATFORM_CONFIG.IS_WEB) {
            // For web, the refresh token is handled by HTTP-only cookies from the backend
            sessionStorage.setItem(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN, token);
            return;
        } else {
            try {
                await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN, token);
            } catch (error) {
                console.error('Error storing refresh token:', error);
            }
        }
    },

    async getRefreshToken() {
        if (PLATFORM_CONFIG.IS_WEB) {
            return sessionStorage.getItem(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN);
        } else {
            try {
                return await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN);
            } catch (error) {
                console.error('Error getting refresh token:', error);
                return null;
            }
        }
    },

    async setUser(user: any) {
        const userData = JSON.stringify(user);
        if (PLATFORM_CONFIG.IS_WEB) {
            sessionStorage.setItem(AUTH_CONFIG.TOKEN_KEYS.USER, userData);
        } else {
            try {
                await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEYS.USER, userData);
            } catch (error) {
                console.error('Error storing user data:', error);
            }
        }
    },

    async getUser() {
        if (PLATFORM_CONFIG.IS_WEB) {
            const userData = sessionStorage.getItem(AUTH_CONFIG.TOKEN_KEYS.USER);
            return userData ? JSON.parse(userData) : null;
        } else {
            try {
                const userData = await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEYS.USER);
                return userData ? JSON.parse(userData) : null;
            } catch (error) {
                console.error('Error getting user data:', error);
                return null;
            }
        }
    },

    async clear() {
        if (PLATFORM_CONFIG.IS_WEB) {
            sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN);
            sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEYS.USER);
            // Note: Refresh token is handled by HTTP-only cookies on web
        } else {
            try {
                await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN);
                await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN);
                await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEYS.USER);
            } catch (error) {
                console.error('Error clearing storage:', error);
            }
        }
    }
};

type User = {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    photo?: string;
    active?: boolean;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    signOut: () => Promise<void>;
    handleAuthRedirect: (url: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend configuration
// const BACKEND_URL = Platform.select({
//   web: 'http://10.144.89.109:8080',
//   default: 'http://10.144.89.109:8080', // Android emulator localhost
// });

const BACKEND_URL = API_CONFIG.BACKEND_URL;

// Platform-specific auth handlers
const handleAuth = async (authUrl: string, redirectUri: string) => {
    // Add platform parameter to the redirect URI
    const platformRedirectUri = `${redirectUri}?platform=${Platform.OS}`;
    const finalAuthUrl = authUrl.replace(encodeURIComponent(redirectUri), encodeURIComponent(platformRedirectUri));

    if (Platform.OS === 'web') {
        window.location.href = finalAuthUrl;
    } else {
        // For mobile, use WebBrowser but with web flow
        const result = await WebBrowser.openAuthSessionAsync(
            finalAuthUrl,
            platformRedirectUri,
            {
                showInRecents: true,
                preferEphemeralSession: false,
            }
        );

        if (result.type === 'success') {
            const url = result.url;
            const code = new URL(url).searchParams.get('code');
            if (code) {
                // Exchange code for tokens
                const { access_token, refresh_token } = await exchangeCodeForTokens(code, platformRedirectUri);

                // Store tokens securely
                await SecureStore.setItemAsync("access_token", access_token);
                await SecureStore.setItemAsync("refresh_token", refresh_token);

                // Get and store user data
                const userData = await fetchAndStoreUserData(access_token);
                return userData;
            }
        }
        throw new Error("Failed to get authorization code");
    }
};

const exchangeCodeForTokens = async (code: string, redirectUri: string) => {
    const tokenResponse = await fetch(`${BACKEND_URL}/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }),
    });

    if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for tokens");
    }

    return tokenResponse.json();
};

const fetchAndStoreUserData = async (access_token: string) => {
    const userResponse = await fetchWithAuth("/api/v1/user/me");
    if (!userResponse.ok) {
        throw new Error("Failed to get user info");
    }

    const userData = await userResponse.json();
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
    return userData;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await storage.getUser();
            const access_token = await storage.getAccessToken();

            if (userData && access_token) {
                setUser(userData);
            } else if (userData) {
                // If we have user data but no token, try to refresh
                const refreshed = await checkAndRefreshToken();
                if (refreshed) {
                    setUser(userData);
                } else {
                    // If refresh failed, clear user data
                    await storage.clear();
                    setUser(null);
                }
            }
        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_CONFIG.BACKEND_URL}${AUTH_CONFIG.AUTH_ENDPOINTS.SIGNIN}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: PLATFORM_CONFIG.IS_WEB ? 'include' : 'omit',
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const json = await response.json();
            const { access_token, refresh_token } = json.data;
            console.error('access_token', access_token);
            console.error('refresh_token', refresh_token);

            // Store tokens using platform-specific storage
            await storage.setAccessToken(access_token);
            if (!PLATFORM_CONFIG.IS_WEB) {
                await storage.setRefreshToken(refresh_token);
            }

            // Get user info
            const userResponse = await fetchWithAuth(AUTH_CONFIG.AUTH_ENDPOINTS.USER_ME);
            if (!userResponse.ok) {
                throw new Error("Failed to get user info");
            }


            const userData = await userResponse.json();

            console.error('userData', userData);

            await storage.setUser(userData.data);
            setUser(userData);

            router.replace("/(tabs)");
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_CONFIG.BACKEND_URL}${AUTH_CONFIG.AUTH_ENDPOINTS.SIGNUP}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, firstName, lastName }),
                credentials: PLATFORM_CONFIG.IS_WEB ? 'include' : 'omit',
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }



            const json = await response.json();
            const { access_token, refresh_token } = json.data;
            console.error('access_token', access_token);
            console.error('refresh_token', refresh_token);

            // Store tokens using platform-specific storage
            await storage.setAccessToken(access_token);
            if (!PLATFORM_CONFIG.IS_WEB) {
                await storage.setRefreshToken(refresh_token);
            }

            // Get user info
            const userResponse = await fetchWithAuth(AUTH_CONFIG.AUTH_ENDPOINTS.USER_ME);
            if (!userResponse.ok) {
                throw new Error("Failed to get user info");
            }

            const userData = await userResponse.json();

            await storage.setUser(userData.data);
            setUser(userData);

            router.replace("/(tabs)");
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            await fetchWithAuth(AUTH_CONFIG.AUTH_ENDPOINTS.LOGOUT, {
                method: "POST",
                credentials: PLATFORM_CONFIG.IS_WEB ? 'include' : 'omit',
            });
            await storage.clear();
            setUser(null);
            router.replace("/");
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            const redirectUri = makeRedirectUri({
                scheme: OAUTH_CONFIG.REDIRECT_URI.SCHEME,
                path: OAUTH_CONFIG.REDIRECT_URI.PATH,
            });

            const authUrl = `${API_CONFIG.BACKEND_URL}${OAUTH_CONFIG.PROVIDERS.GOOGLE}?redirect_uri=${encodeURIComponent(redirectUri)}`;

            if (PLATFORM_CONFIG.IS_WEB) {
                await handleAuth(authUrl, redirectUri);
            } else {
                const userData = await handleAuth(authUrl, redirectUri);
                if (userData) {
                    setUser(userData);
                    router.replace("/(tabs)");
                }
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGithub = async () => {
        try {
            setIsLoading(true);
            const redirectUri = makeRedirectUri({
                scheme: OAUTH_CONFIG.REDIRECT_URI.SCHEME,
                path: OAUTH_CONFIG.REDIRECT_URI.PATH,
            });

            const authUrl = `${API_CONFIG.BACKEND_URL}${OAUTH_CONFIG.PROVIDERS.GITHUB}?redirect_uri=${encodeURIComponent(redirectUri)}`;

            if (PLATFORM_CONFIG.IS_WEB) {
                await handleAuth(authUrl, redirectUri);
            } else {
                const userData = await handleAuth(authUrl, redirectUri);
                if (userData) {
                    setUser(userData);
                    router.replace("/(tabs)");
                }
            }
        } catch (error) {
            console.error("Error signing in with GitHub:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthRedirect = async (url: string) => {
        try {
            setIsLoading(true);

            // Handle web-specific flow
            if (Platform.OS === 'web') {
                // Handle both backend and frontend URLs
                const urlObj = new URL(url);
                const uuid = urlObj.searchParams.get("uuid");

                if (!uuid) {
                    throw new Error("No UUID found in redirect URL");
                }

                // Exchange UUID for tokens
                const tokenResponse = await fetch(`${BACKEND_URL}/auth/exchange?uuid=${uuid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!tokenResponse.ok) {
                    throw new Error("Failed to exchange UUID for tokens");
                }

                const json = await tokenResponse.json();
                const { access_token, refresh_token } = json.data;
                // Store tokens using platform-specific storage
                await storage.setAccessToken(access_token);
                if (!PLATFORM_CONFIG.IS_WEB) {
                    await storage.setRefreshToken(refresh_token);
                }

                // Get user info using the access token
                const userResponse = await fetchWithAuth("/api/v1/user/me");

                if (!userResponse.ok) {
                    throw new Error("Failed to get user info");
                }

                const userData = await userResponse.json();

                // Create a properly formatted user object
                const formattedUser: User = {
                    id: userData.id || '',
                    email: userData.email || null,
                    firstName: userData.firstName || null,
                    lastName: userData.lastName || null,
                    photo: userData.photo || undefined,
                    active: userData.active || false,
                };

                // Store user data and update state
                await storage.setUser(formattedUser);
                setUser(formattedUser);

                // Notify parent window about successful authentication
                if (window.opener) {
                    console.log('Sending message to opener window'); // Debug log
                    window.opener.postMessage({
                        type: 'AUTH_SUCCESS',
                        user: formattedUser,
                        access_token: access_token,
                        refresh_token: refresh_token
                    }, '*');

                    // Wait a bit before closing to ensure message is sent
                    setTimeout(() => {
                        window.close();
                    }, 100);
                } else {
                    // If we're in the parent window, redirect to tabs
                    console.log('No opener window, redirecting directly'); // Debug log
                    router.replace("/(tabs)");
                }
                return;
            }

            // Handle mobile platforms
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                const urlObj = new URL(url);
                const uuid = urlObj.searchParams.get("uuid");

                if (!uuid) {
                    throw new Error("No UUID found in redirect URL");
                }

                // Exchange UUID for tokens
                const tokenResponse = await fetch(`${BACKEND_URL}/auth/exchange?uuid=${uuid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!tokenResponse.ok) {
                    throw new Error("Failed to exchange UUID for tokens");
                }

                const { access_token, refresh_token } = await tokenResponse.json();

                // Store tokens using platform-specific storage
                await storage.setAccessToken(access_token);
                await storage.setRefreshToken(refresh_token);

                // Get user info using the access token
                const userResponse = await fetchWithAuth("/api/v1/user/me");

                if (!userResponse.ok) {
                    throw new Error("Failed to get user info");
                }

                const userData = await userResponse.json();

                // Create a properly formatted user object
                const formattedUser: User = {
                    id: userData.id || '',
                    email: userData.email || null,
                    firstName: userData.firstName || null,
                    lastName: userData.lastName || null,
                    photo: userData.photo || undefined,
                    active: userData.active || false,
                };

                // Store user data and update state
                await storage.setUser(formattedUser);
                setUser(formattedUser);

                // Navigate to dashboard
                router.replace("/(tabs)");
            }
        } catch (error) {
            console.error("Error handling auth redirect:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Add a function to check and refresh token if needed
    const checkAndRefreshToken = async () => {
        try {
            const currentAccessToken = await storage.getAccessToken();
            if (!currentAccessToken) return false;

            if (PLATFORM_CONFIG.IS_WEB) {
                // For web, the refresh token is handled by HTTP-only cookies
                const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: "POST",
                    credentials: 'include', // Include cookies
                });

                if (!response.ok) {
                    throw new Error("Failed to refresh token");
                }

                const { access_token } = await response.json();
                await storage.setAccessToken(access_token);
                return true;
            } else {
                const refresh_token = await storage.getRefreshToken();
                if (!refresh_token) return false;

                const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refresh_token }),
                });

                if (!response.ok) {
                    throw new Error("Failed to refresh token");
                }

                const { access_token, new_refresh_token } = await response.json();
                await storage.setAccessToken(access_token);
                await storage.setRefreshToken(new_refresh_token);
                return true;
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signIn,
                signUp,
                signOut,
                handleAuthRedirect,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
