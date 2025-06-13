import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function SignUp() {
    const insets = useSafeAreaInsets();
    const { signUp, isLoading } = useAuth();
    const { language, translations: t } = useLanguage();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = language === 'en' ? 'First name is required' : 'पहिलो नाम आवश्यक छ';
        }

        if (!lastName.trim()) {
            newErrors.lastName = language === 'en' ? 'Last name is required' : 'थर आवश्यक छ';
        }

        if (!email.trim()) {
            newErrors.email = language === 'en' ? 'Email is required' : 'इमेल आवश्यक छ';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
        }

        if (!password) {
            newErrors.password = language === 'en' ? 'Password is required' : 'पासवर्ड आवश्यक छ';
        } else if (password.length < 8) {
            newErrors.password = language === 'en' ? 'Password must be at least 8 characters long' : 'पासवर्ड कम्तिमा ८ अक्षर लामो हुनुपर्छ';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = language === 'en' ? 'Please confirm your password' : 'कृपया आफ्नो पासवर्ड पुष्टि गर्नुहोस्';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = language === 'en' ? 'Passwords do not match' : 'पासवर्डहरू मिल्दैनन्';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        setApiError('');
        if (!validateForm()) {
            return;
        }

        try {
            await signUp(email, password, firstName, lastName);
        } catch (error: any) {
            console.error('Error signing up:', error);
            setApiError(error.message || (language === 'en' ? 'An error occurred during sign up' : 'साइन अप गर्दा त्रुटि भयो'));
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    gestureEnabled: false, // Disable back gesture
                }}
            />
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar style="dark" />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace('/language' as any)} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{t[language].createAccount}</Text>
                </View>

                <View style={styles.content}>
                    {apiError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{apiError}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputContainer}>
                        <View>
                            <TextInput
                                style={[styles.input, errors.firstName && styles.inputError]}
                                placeholder={t[language].firstName}
                                autoCapitalize="words"
                                value={firstName}
                                onChangeText={(text) => {
                                    setFirstName(text);
                                    if (errors.firstName) {
                                        setErrors({ ...errors, firstName: undefined });
                                    }
                                }}
                            />
                            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                        </View>

                        <View>
                            <TextInput
                                style={[styles.input, errors.lastName && styles.inputError]}
                                placeholder={t[language].lastName}
                                autoCapitalize="words"
                                value={lastName}
                                onChangeText={(text) => {
                                    setLastName(text);
                                    if (errors.lastName) {
                                        setErrors({ ...errors, lastName: undefined });
                                    }
                                }}
                            />
                            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                        </View>

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

                        <View>
                            <TextInput
                                style={[styles.input, errors.confirmPassword && styles.inputError]}
                                placeholder={t[language].confirmPassword}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) {
                                        setErrors({ ...errors, confirmPassword: undefined });
                                    }
                                }}
                            />
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={handleSignUp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.signUpButtonText}>{t[language].signUp}</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>{language === 'en' ? 'or continue with' : 'वा यसबाट जारी राख्नुहोस्'}</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.signInContainer}>
                        <Text style={styles.signInText}>
                            {language === 'en' ? 'Already have an account? ' : 'पहिले नै खाता छ? '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in' as any)}>
                            <Text style={styles.signInLink}>{t[language].signIn}</Text>
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
    },
    inputError: {
        borderWidth: 1,
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
    signUpButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#666',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    signInText: {
        color: '#666',
    },
    signInLink: {
        color: '#007AFF',
        fontWeight: '600',
    },
});