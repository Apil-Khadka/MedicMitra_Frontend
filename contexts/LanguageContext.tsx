import { storage } from '@/utils/Storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ne' | 'bh' | 'mai';

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    translations: typeof translations;
    t: (key: string) => string;
    isLoading: boolean;
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
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    // Function to get translation
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key} for language: ${language}`);
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    if (!isInitialized) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translations, t, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
}

// Translation strings
export const translations = {
    en: {
        // Common
        welcome: 'Welcome to MedicMitra',
        subtitle: 'Your Digital Health Assistant',
        selectLanguage: 'Select Language',
        english: 'English',
        nepali: 'Nepali',
        bhojpuri: 'Bhojpuri',
        maithili: 'Maithili',
        continue: 'Continue',
        error: 'Error',
        loading: 'Loading...',

        // Auth
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        forgotPassword: 'Forgot Password?',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
        changeMethod: 'Change method',

        // Profile
        editProfile: 'Edit Profile',
        accountSettings: 'Account Settings',
        notifications: 'Notifications',
        privacySecurity: 'Privacy & Security',
        support: 'Support',
        helpCenter: 'Help Center',

        // Home
        scanMedicine: 'Scan Medicine',
        howItWorks: 'How it works',

        // Database
        searchMedicines: 'Search Medicines',
        searchFailed: 'Failed to search medicines',
        noResults: 'No medicines found',
        searchPlaceholder: 'Search medicines...',
        noMedicinesFound: 'No Medicines Found',
        searchInstructions: 'Search for medicines by name, generic name, or manufacturer',

        // History
        historyTitle: 'History',
        noHistory: 'No History Yet',
        historySubtitle: 'Your scanned medicines will appear here',

        // Menu
        fullDatabase: 'Full Database',
        menuHistory: 'History',
        menuProfile: 'Profile',
        settings: 'Settings',
    },
    ne: {
        // Common
        welcome: 'मेडिकमित्रामा स्वागत छ',
        subtitle: 'तपाईंको डिजिटल स्वास्थ्य सहायक',
        selectLanguage: 'भाषा चयन गर्नुहोस्',
        english: 'अंग्रेजी',
        nepali: 'नेपाली',
        bhojpuri: 'भोजपुरी',
        maithili: 'मैथिली',
        continue: 'जारी राख्नुहोस्',
        error: 'त्रुटि',
        loading: 'लोड हुँदैछ...',

        // Auth
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        signOut: 'साइन आउट',
        email: 'इमेल',
        password: 'पासवर्ड',
        confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
        firstName: 'पहिलो नाम',
        lastName: 'थर',
        forgotPassword: 'पासवर्ड बिर्सनुभयो?',
        createAccount: 'खाता सिर्जना गर्नुहोस्',
        alreadyHaveAccount: 'पहिले नै खाता छ?',
        dontHaveAccount: 'खाता छैन?',
        changeMethod: 'विधि परिवर्तन गर्नुहोस्',

        // Profile
        editProfile: 'प्रोफाइल सम्पादन गर्नुहोस्',
        accountSettings: 'खाता सेटिङहरू',
        notifications: 'सूचनाहरू',
        privacySecurity: 'गोपनीयता र सुरक्षा',
        support: 'सहयोग',
        helpCenter: 'सहयोग केन्द्र',

        // Home
        scanMedicine: 'औषधि स्क्यान गर्नुहोस्',
        howItWorks: 'कसरी काम गर्छ',

        // Database
        searchMedicines: 'औषधि खोज्नुहोस्',
        searchFailed: 'औषधि खोज्न असफल भयो',
        noResults: 'कुनै औषधि भेटिएन',
        searchPlaceholder: 'औषधि खोज्नुहोस्...',
        noMedicinesFound: 'कुनै औषधि भेटिएन',
        searchInstructions: 'नाम, जेनेरिक नाम, वा निर्माता द्वारा औषधि खोज्नुहोस्',

        // History
        historyTitle: 'इतिहास',
        noHistory: 'अहिलेसम्म कुनै इतिहास छैन',
        historySubtitle: 'तपाईंले स्क्यान गरेका औषधिहरू यहाँ देखा पर्नेछन्',

        // Menu
        fullDatabase: 'पूर्ण डाटाबेस',
        menuHistory: 'इतिहास',
        menuProfile: 'प्रोफाइल',
        settings: 'सेटिङहरू',
    },
    bh: {
        // Common
        welcome: 'मेडिकमित्रा में स्वागत बा',
        subtitle: 'राउर डिजिटल स्वास्थ्य सहायक',
        selectLanguage: 'भाषा चुनीं',
        english: 'अंग्रेजी',
        nepali: 'नेपाली',
        bhojpuri: 'भोजपुरी',
        maithili: 'मैथिली',
        continue: 'जारी रखीं',
        error: 'त्रुटि',
        loading: 'लोड हो रहल बा...',

        // Auth
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        signOut: 'साइन आउट',
        email: 'ईमेल',
        password: 'पासवर्ड',
        confirmPassword: 'पासवर्ड कन्फर्म करीं',
        firstName: 'पहिलका नाम',
        lastName: 'थर',
        forgotPassword: 'पासवर्ड भूल गइल बानी?',
        createAccount: 'खाता बनावीं',
        alreadyHaveAccount: 'पहिले से खाता बा?',
        dontHaveAccount: 'खाता नइखे?',
        changeMethod: 'विधि बदलीं',

        // Profile
        editProfile: 'प्रोफाइल एडिट करीं',
        accountSettings: 'खाता सेटिंग',
        notifications: 'नोटिफिकेशन',
        privacySecurity: 'प्राइवेसी आ सुरक्षा',
        support: 'सहयोग',
        helpCenter: 'हेल्प सेंटर',

        // Home
        scanMedicine: 'औषधि स्क्यान करीं',
        howItWorks: 'कइसे काम करेला',

        // Database
        searchMedicines: 'औषधि खोजीं',
        searchFailed: 'औषधि खोजे में असफल भइल',
        noResults: 'कोनो औषधि नइखे',
        searchPlaceholder: 'औषधि खोजीं...',
        noMedicinesFound: 'कोनो औषधि नइखे',
        searchInstructions: 'नाम, जेनेरिक नाम, या निर्माता से औषधि खोजीं',

        // History
        historyTitle: 'इतिहास',
        noHistory: 'अभी ले कोनो इतिहास नइखे',
        historySubtitle: 'राउर स्क्यान कइल औषधि इहाँ देखाई देब',

        // Menu
        fullDatabase: 'पूरा डाटाबेस',
        menuHistory: 'इतिहास',
        menuProfile: 'प्रोफाइल',
        settings: 'सेटिंग',
    },
    mai: {
        // Common
        welcome: 'मेडिकमित्रा में स्वागत अछि',
        subtitle: 'अहाँक डिजिटल स्वास्थ्य सहायक',
        selectLanguage: 'भाषा चुनू',
        english: 'अंग्रेजी',
        nepali: 'नेपाली',
        bhojpuri: 'भोजपुरी',
        maithili: 'मैथिली',
        continue: 'जारी राखू',
        error: 'त्रुटि',
        loading: 'लोड होइत अछि...',

        // Auth
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        signOut: 'साइन आउट',
        email: 'ईमेल',
        password: 'पासवर्ड',
        confirmPassword: 'पासवर्ड पुष्टि करू',
        firstName: 'पहिल नाम',
        lastName: 'थर',
        forgotPassword: 'पासवर्ड भूलि गेल छथि?',
        createAccount: 'खाता बनाऊ',
        alreadyHaveAccount: 'पहिले से खाता अछि?',
        dontHaveAccount: 'खाता नहि अछि?',
        changeMethod: 'विधि बदलू',

        // Profile
        editProfile: 'प्रोफाइल एडिट करू',
        accountSettings: 'खाता सेटिंग',
        notifications: 'नोटिफिकेशन',
        privacySecurity: 'प्राइवेसी आ सुरक्षा',
        support: 'सहयोग',
        helpCenter: 'हेल्प सेंटर',

        // Home
        scanMedicine: 'औषधि स्क्यान करू',
        howItWorks: 'कहिया काम करैत अछि',

        // Database
        searchMedicines: 'औषधि खोजू',
        searchFailed: 'औषधि खोजबाक कोशिश असफल भेल',
        noResults: 'कोनो औषधि नहि भेटल',
        searchPlaceholder: 'औषधि खोजू...',
        noMedicinesFound: 'कोनो औषधि नहि भेटल',
        searchInstructions: 'नाम, जेनेरिक नाम, या निर्माता से औषधि खोजू',

        // History
        historyTitle: 'इतिहास',
        noHistory: 'अभी धरि कोनो इतिहास नहि अछि',
        historySubtitle: 'अहाँक स्क्यान कएल औषधि इहाँ देखाई देब',

        // Menu
        fullDatabase: 'पूरा डाटाबेस',
        menuHistory: 'इतिहास',
        menuProfile: 'प्रोफाइल',
        settings: 'सेटिंग',
    },
};