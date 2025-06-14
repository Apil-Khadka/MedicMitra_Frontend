import { AUTH_CONFIG } from "@/config/constants";
import * as SecureStore from "expo-secure-store";

export const storage = {
    setAccessToken: async function (token: string) {
        try {
            await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN, token);
        } catch (error) {
            console.error('Error storing access token:', error);
        }
    },
    async getAccessToken() {
        try {
            return await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    },
    async setRefreshToken(token: string) {
        try {
            await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN, token);
        } catch (error) {
            console.error('Error storing refresh token:', error);
        }
    },
    async getRefreshToken() {
        try {
            return await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    },
    async setUser(user: any) {
        const userData = JSON.stringify(user);
        try {
            await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEYS.USER, userData);
        } catch (error) {
            console.error('Error storing user data:', error);
        }
    },

    async getUser() {
        try {
            const userData = await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEYS.USER);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    async clear() {
        try {
            await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEYS.ACCESS_TOKEN);
            await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEYS.REFRESH_TOKEN);
            await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEYS.USER);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },
    async setLanguage(language: string) {
        try {
            console.log('Storage: Setting language to:', language);
            await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEYS.LANGUAGE, language);
            console.log('Storage: Language saved successfully');
        } catch (error) {
            console.error('Storage: Error storing language:', error);
        }
    },
    async getLanguage() {
        try {
            const language = await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEYS.LANGUAGE);
            console.log('Storage: Retrieved language:', language);
            return language;
        } catch (error) {
            console.error('Storage: Error getting language:', error);
            return null;
        }
    }
};