import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { API_CONFIG, AUTH_CONFIG, PLATFORM_CONFIG } from '@/config/constants';
import { fetchWithAuth } from "@/utils/api";
import { storage } from "@/utils/Storage";

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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await loadUser();
        };
        init();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await storage.getUser();
            const access_token = await storage.getAccessToken();

            if (userData && access_token) {
                setUser(userData);
            } else if (userData) {
                const isRefreshed = await checkAndRefreshToken();
                if (isRefreshed) {
                    setUser(userData);
                } else {
                    await storage.clear();
                    setUser(null);
                }
            }
        } catch (error) {
            if (__DEV__) console.error("Error loading user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_CONFIG.BACKEND_URL}${AUTH_CONFIG.AUTH_ENDPOINTS.SIGNIN}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: PLATFORM_CONFIG.IS_WEB ? 'include' : 'omit',
            });

            if (!response.ok) throw new Error("Login failed");
            await handleAuthSuccess(await response.json());
        } catch (error) {
            if (__DEV__) console.error("Error signing in:", error);
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, firstName, lastName }),
                credentials: 'omit',
            });

            if (!response.ok) throw new Error("Registration failed");
            await handleAuthSuccess(await response.json());
        } catch (error) {
            if (__DEV__) console.error("Error signing up:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            const refresh_token = await storage.getRefreshToken();
            const response = await fetchWithAuth(AUTH_CONFIG.AUTH_ENDPOINTS.LOGOUT, {
                method: "POST",
                credentials: 'omit',
                body: refresh_token
            });
            console.error("signout response",response.json());
            await storage.clear();
            setUser(null);
            router.replace("/");
        } catch (error) {
            if (__DEV__) console.error("Error signing out:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const checkAndRefreshToken = async () => {
        try {
            const currentAccessToken = await storage.getAccessToken();
            if (!currentAccessToken) return false;

            const refresh_token = await storage.getRefreshToken();
            if (!refresh_token) return false;

            const response = await fetch(`${API_CONFIG.BACKEND_URL}${AUTH_CONFIG.AUTH_ENDPOINTS.REFRESH}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token }),
            });

            if (!response.ok) throw new Error("Failed to refresh token");

            const json = await response.json();
            const { access_token, new_refresh_token } = json.data;
            await storage.setAccessToken(access_token);
            await storage.setRefreshToken(new_refresh_token);
            return true;
        } catch (error) {
            if (__DEV__) console.error("Error refreshing token:", error);
            return false;
        }
    };

    async function handleAuthSuccess(json: any) {
        const { access_token, refresh_token } = json.data;
        await storage.setAccessToken(access_token);
        await storage.setRefreshToken(refresh_token);

        const userResponse = await fetchWithAuth(AUTH_CONFIG.AUTH_ENDPOINTS.USER_ME);
        if (!userResponse.ok) throw new Error("Failed to get user info");

        const userData = await userResponse.json();
        await storage.setUser(userData.data);
        setUser(userData.data);

        router.replace("/(tabs)");
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signIn,
                signUp,
                signOut,
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