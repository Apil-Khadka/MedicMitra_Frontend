import { storage } from '@/utils/Storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeLanguage = async () => {
            try {
                const savedLanguage = await storage.getLanguage();
                console.log('Retrieved saved language:', savedLanguage);
                if (savedLanguage && isValidLanguage(savedLanguage)) {
                    console.log('Setting language to:', savedLanguage);
                    setLanguageState(savedLanguage as Language);
                } else {
                    console.log('Invalid or no saved language, using default:', 'en');
                }
                setIsInitialized(true);
            } catch (error) {
                console.error('Error loading language:', error);
                setIsInitialized(true);
            } finally {
                setIsLoading(false);
            }
        };

        initializeLanguage();
    }, []);

    const isValidLanguage = (lang: string): lang is Language => {
        const isValid = ['en', 'ne', 'bh', 'mai'].includes(lang);
        console.log('Validating language:', lang, 'isValid:', isValid);
        return isValid;
    };

    const setLanguage = async (lang: Language) => {
        try {
            console.log('Setting new language:', lang);
            await storage.setLanguage(lang);
            console.log('Language saved to storage');
            setLanguageState(lang);
            // Force a re-render of components using the language
            setIsInitialized(false);
            setTimeout(() => setIsInitialized(true), 0);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    if (!isInitialized) {
        return null;
    }

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