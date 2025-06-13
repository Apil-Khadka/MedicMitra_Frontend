import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface FormErrors {
    email?: string;
    password?: string;
}

export default function SignInEmail() {
    const insets = useSafeAreaInsets();
    const { signIn } = useAuth();
    const { language, translations: t, setLanguage } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!email.trim()) {
            newErrors.email = language === 'en' ? 'Email is required' : 'इमेल आवश्यक छ';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
        }

        if (!password) {
            newErrors.password = language === 'en' ? 'Password is required' : 'पासवर्ड आवश्यक छ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        setApiError('');
        if (!validateForm()) {
            return;
        }

        setIsVerifying(true);
        try {
            // In a real app, this would trigger Google verification
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 2000));
            await signIn(email, password);
        } catch (error: any) {
            console.error('Error signing in:', error);
            setApiError(error.message || (language === 'en' ? 'Invalid email or password' : 'अमान्य इमेल वा पासवर्ड'));
        } finally {
            setIsVerifying(false);
        }
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
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t[language].signIn}</Text>
        </View>

    {renderLanguageSelector()}

    <View style={styles.content}>
        {apiError ? (
                <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{apiError}</Text>
                    </View>
            ) : null}

        <View style={styles.inputContainer}>
    <View>
        <TextInput
            style={[styles.input, errors.email && styles.inputError]}
    placeholder={t[language].email}
    keyboardType="email-address"
    autoCapitalize="none"
    value={email}
    onChangeText={(text) => {
        setEmail(text);
        if (errors.email) {
            setErrors({ ...errors, email: undefined });
        }
    }}
    />
    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
    </View>

    <View>
    <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder={t[language].password}
        secureTextEntry
        value={password}
        onChangeText={(text) => {
        setPassword(text);
        if (errors.password) {
            setErrors({ ...errors, password: undefined });
        }
    }}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>{t[language].forgotPassword}</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            disabled={isVerifying}
                >
                {isVerifying ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signInButtonText}>
                        {language === 'en' ? 'Sign in with Google' : 'गुगलबाट साइन इन गर्नुहोस्'}
                </Text>
        )}
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
            backButton: {
                marginRight: 15,
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
            inputContainer: {
                gap: 15,
            },
            input: {
                backgroundColor: '#f5f5f5',
                paddingHorizontal: 15,
                paddingVertical: 12,
                borderRadius: 10,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0',
            },
            inputError: {
                borderColor: '#ff3b30',
            },
            errorContainer: {
                backgroundColor: '#ffebee',
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
            },
            errorText: {
                color: '#ff3b30',
                fontSize: 12,
                marginTop: 4,
            },
            forgotPassword: {
                alignSelf: 'flex-end',
                marginTop: 10,
            },
            forgotPasswordText: {
                color: '#007AFF',
                fontSize: 14,
            },
            signInButton: {
                backgroundColor: '#007AFF',
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 20,
            },
            signInButtonText: {
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
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
        });