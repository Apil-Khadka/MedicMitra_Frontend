import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

type SignUpStep = 'initial' | 'email-password' | 'phone-otp' | 'name' | 'verification';

interface FormErrors {
    email?: string;
    phone?: string;
    password?: string;
    otp?: string;
    firstName?: string;
    lastName?: string;
}

export default function SignUp() {
    const insets = useSafeAreaInsets();
    const { signUp, isLoading } = useAuth();
    const { language, translations: t, setLanguage } = useLanguage();

    // Form state
    const [step, setStep] = useState<SignUpStep>('initial');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);

    const validateEmail = (email: string): boolean => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        // Basic phone validation - can be enhanced based on requirements
        return /^\+?[\d\s-]{10,}$/.test(phone);
    };

    const validateInitialStep = (): boolean => {
        const newErrors: FormErrors = {};
        if (email && !validateEmail(email)) {
            newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
        }
        if (phone && !validatePhone(phone)) {
            newErrors.phone = language === 'en' ? 'Please enter a valid phone number' : 'कृपया मान्य फोन नम्बर प्रविष्ट गर्नुहोस्';
        }
        if (!email && !phone) {
            newErrors.email = language === 'en' ? 'Please enter either email or phone number' : 'कृपया इमेल वा फोन नम्बर प्रविष्ट गर्नुहोस्';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInitialSubmit = () => {
        if (!validateInitialStep()) return;

        if (email) {
            setStep('email-password');
        } else if (phone) {
            // In a real app, this would trigger an API call to send OTP
            setStep('phone-otp');
            // Simulate OTP sending
            Alert.alert(
                language === 'en' ? 'OTP Sent' : 'OTP पठाइयो',
                language === 'en' ? 'A 6-digit code has been sent to your phone' : 'तपाईंको फोनमा ६ अंकको कोड पठाइयो'
            );
        }
    };

    const handleEmailPasswordSubmit = async () => {
        if (!password) {
            setErrors({ password: language === 'en' ? 'Password is required' : 'पासवर्ड आवश्यक छ' });
            return;
        }
        setIsVerifying(true);
        // In a real app, this would trigger Google verification
        // For now, we'll simulate it
        setTimeout(() => {
            setIsVerifying(false);
            setStep('name');
        }, 2000);
    };

    const handleOtpSubmit = () => {
        if (!otp || otp.length !== 6) {
            setErrors({ otp: language === 'en' ? 'Please enter a valid 6-digit code' : 'कृपया मान्य ६ अंकको कोड प्रविष्ट गर्नुहोस्' });
            return;
        }
        // In a real app, this would verify the OTP
        setStep('name');
    };

    const handleNameSubmit = async () => {
        try {
            // In a real app, this would call the signUp API
            await signUp(email || phone, password || 'auto-generated', firstName, lastName);
            router.replace('/(tabs)');
        } catch (error: any) {
            setApiError(error.message || (language === 'en' ? 'An error occurred during sign up' : 'साइन अप गर्दा त्रुटि भयो'));
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

    const renderStep = () => {
        switch (step) {
            case 'initial':
                return (
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
                                    setPhone('');
                                    if (errors.email) setErrors({ ...errors, email: undefined });
                                }}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>
                        <Text style={styles.orText}>{language === 'en' ? 'OR' : 'वा'}</Text>
                        <View>
                            <TextInput
                                style={[styles.input, errors.phone && styles.inputError]}
                                placeholder={language === 'en' ? 'Phone Number' : 'फोन नम्बर'}
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={(text) => {
                                    setPhone(text);
                                    setEmail('');
                                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                                }}
                            />
                            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                        </View>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleInitialSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.continueButtonText}>{t[language].continue}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );

            case 'email-password':
                return (
                    <View style={styles.inputContainer}>
                        <View>
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                placeholder={t[language].password}
                                secureTextEntry
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleEmailPasswordSubmit}
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.continueButtonText}>
                                    {language === 'en' ? 'Verify with Google' : 'गुगलबाट प्रमाणित गर्नुहोस्'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );

            case 'phone-otp':
                return (
                    <View style={styles.inputContainer}>
                        <View>
                            <TextInput
                                style={[styles.input, errors.otp && styles.inputError]}
                                placeholder={language === 'en' ? 'Enter 6-digit code' : '६ अंकको कोड प्रविष्ट गर्नुहोस्'}
                                keyboardType="number-pad"
                                maxLength={6}
                                value={otp}
                                onChangeText={(text) => {
                                    setOtp(text);
                                    if (errors.otp) setErrors({ ...errors, otp: undefined });
                                }}
                            />
                            {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
                        </View>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleOtpSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.continueButtonText}>{t[language].continue}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );

            case 'name':
                return (
                    <View style={styles.inputContainer}>
                        <Text style={styles.optionalText}>
                            {language === 'en' ? 'Enter your name (optional)' : 'आफ्नो नाम प्रविष्ट गर्नुहोस् (वैकल्पिक)'}
                        </Text>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder={t[language].firstName}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder={t[language].lastName}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleNameSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.continueButtonText}>{t[language].continue}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
    };

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
                    <TouchableOpacity onPress={() => router.replace('/language' as any)} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{t[language].createAccount}</Text>
                </View>

                {renderLanguageSelector()}

                <View style={styles.content}>
                    {apiError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{apiError}</Text>
                        </View>
                    ) : null}

                    {renderStep()}

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
    orText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginVertical: 10,
    },
    continueButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    optionalText: {
        color: '#666',
        fontSize: 14,
        marginBottom: 10,
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