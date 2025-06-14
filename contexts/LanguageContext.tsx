import { storage } from '@/utils/Storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type Language = 'en' | 'ne' | 'bh' | 'mai';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    isLoading: boolean;
    translations: typeof translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app_language';

// Export the hook separately to make it more explicit
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSavedLanguage();
    }, []);

    const loadSavedLanguage = async () => {
        try {
            if (Platform.OS === 'web') {
                const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
                if (savedLanguage) {
                    setLanguageState(savedLanguage);
                }
            } else {
                const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY) as Language;
                if (savedLanguage) {
                    setLanguageState(savedLanguage);
                }
            }
        } catch (error) {
            console.error('Error loading language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await storage.setLanguage(lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isLoading, translations }}>
            {children}
        </LanguageContext.Provider>
    );
}

// Translation strings
export const translations = {
    en: {
        welcome: 'Welcome to MedicMitra',
        subtitle: 'Your Digital Health Assistant',
        selectLanguage: 'Select Language',
        english: 'English',
        nepali: 'Nepali',
        bhojpuri: 'Bhojpuri',
        maithili: 'Maithili',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        email: 'Email',
        password: 'Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        forgotPassword: 'Forgot Password?',
        createAccount: 'Create Account',
        confirmPassword: 'Confirm Password',
        continue: 'Continue',
        name: 'Full Name',
    },
    ne: {
        welcome: 'मेडिकमित्रामा स्वागत छ',
        subtitle: 'तपाईंको डिजिटल स्वास्थ्य सहायक',
        selectLanguage: 'भाषा चयन गर्नुहोस्',
        english: 'अंग्रेजी',
        nepali: 'नेपाली',
        bhojpuri: 'भोजपुरी',
        maithili: 'मैथिली',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        email: 'इमेल',
        password: 'पासवर्ड',
        firstName: 'पहिलो नाम',
        lastName: 'थर',
        forgotPassword: 'पासवर्ड बिर्सनुभयो?',
        createAccount: 'खाता सिर्जना गर्नुहोस्',
        confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
        continue: 'जारी राख्नुहोस्',
        name: 'पूरा नाम',
    },
    bh: {
        welcome: 'मेडिकमित्रा में स्वागत बा',
        subtitle: 'राउर डिजिटल स्वास्थ्य सहायक',
        selectLanguage: 'भाषा चुनीं',
        english: 'अंग्रेजी',
        nepali: 'नेपाली',
        bhojpuri: 'भोजपुरी',
        maithili: 'मैथिली',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        email: 'ईमेल',
        password: 'पासवर्ड',
        firstName: 'पहिलका नाम',
        lastName: 'थर',
        forgotPassword: 'पासवर्ड भूल गइल बानी?',
        createAccount: 'खाता बनावीं',
        confirmPassword: 'पासवर्ड कन्फर्म करीं',
        continue: 'जारी रखीं',
        name: 'पूरा नाम',
    },
    mai: {
        welcome: 'मेडिकमित्रा में स्वागत अछि',
        subtitle: 'अहाँक डिजिटल स्वास्थ्य सहायक',
        selectLanguage: 'भाषा चुनू',
        english: 'अंग्रेजी',
        nepali: 'नेपाली',
        bhojpuri: 'भोजपुरी',
        maithili: 'मैथिली',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        email: 'ईमेल',
        password: 'पासवर्ड',
        firstName: 'पहिल नाम',
        lastName: 'थर',
        forgotPassword: 'पासवर्ड भूलि गेल छथि?',
        createAccount: 'खाता बनाऊ',
        confirmPassword: 'पासवर्ड पुष्टि करू',
        continue: 'जारी राखू',
        name: 'पूरा नाम',
    },
};