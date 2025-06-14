import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

type Theme = {
    dark: boolean;
    colors: typeof Colors.light | typeof Colors.dark;
};

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const colorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(colorScheme === 'dark');

    useEffect(() => {
        setIsDark(colorScheme === 'dark');
    }, [colorScheme]);

    const theme: Theme = {
        dark: isDark,
        colors: isDark ? Colors.dark : Colors.light,
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}