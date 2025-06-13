import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';

type SignInMethod = 'email' | 'phone';

export default function SignIn() {
    const insets = useSafeAreaInsets();
    const { language, translations: t, setLanguage } = useLanguage();

    const handleMethodSelect = (method: SignInMethod) => {
        router.push(method === 'email' ? '/(auth)/sign-in-email' : '/(auth)/sign-in-phone' as any);
    };

    const renderLanguageSelector = () => (
        <View style={styles.languageContainer}>
            <TouchableOpacity
                style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
                onPress={() => setLanguage('en')}
            >
                <Text style={[styles.languageButtonText, language === 'en' && styles.languageButtonTextActive]}>
                    {t.en.english}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.languageButton, language === 'ne' && styles.languageButtonActive]}
                onPress={() => setLanguage('ne')}
            >
                <Text style={[styles.languageButtonText, language === 'ne' && styles.languageButtonTextActive]}>
                    {t.ne.nepali}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar style="dark" />

                <View style={styles.header}>
                    <Text style={styles.title}>{t[language].signIn}</Text>
                </View>

                {renderLanguageSelector()}

                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.methodButton}
                        onPress={() => handleMethodSelect('email')}
                    >
                        <Ionicons name="mail-outline" size={24} color="#007AFF" />
                        <Text style={styles.methodButtonText}>
                            {language === 'en' ? 'Sign in with Email' : 'इमेलबाट साइन इन गर्नुहोस्'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.methodButton}
                        onPress={() => handleMethodSelect('phone')}
                    >
                        <Ionicons name="phone-portrait-outline" size={24} color="#007AFF" />
                        <Text style={styles.methodButtonText}>
                            {language === 'en' ? 'Sign in with Phone' : 'फोनबाट साइन इन गर्नुहोस्'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>
                            {language === 'en' ? "Don't have an account? " : 'खाता छैन? '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up' as any)}>
                            <Text style={styles.signUpLink}>{t[language].signUp}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    languageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 10,
    },
    languageButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    languageButtonActive: {
        backgroundColor: '#007AFF',
    },
    languageButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
    languageButtonTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    methodContainer: {
        gap: 15,
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
        borderRadius: 10,
        gap: 15,
    },
    methodButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingBottom: 20,
    },
    signUpText: {
        color: '#666',
        fontSize: 14,
    },
    signUpLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
    },
});