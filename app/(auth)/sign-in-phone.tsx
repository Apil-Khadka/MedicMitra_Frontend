import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface FormErrors {
    phone?: string;
    otp?: string;
}

type SignInStep = 'phone' | 'otp';

export default function SignInPhone() {
    const insets = useSafeAreaInsets();
    const { signIn } = useAuth();
    const { language, translations: t, setLanguage } = useLanguage();
    const [step, setStep] = useState<SignInStep>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const validatePhone = (phone: string): boolean => {
        // Basic phone validation - can be enhanced based on requirements
        return /^\+?[\d\s-]{10,}$/.test(phone);
    };

    const handlePhoneSubmit = async () => {
        setApiError('');
        if (!phone.trim()) {
            setErrors({ phone: language === 'en' ? 'Phone number is required' : 'फोन नम्बर आवश्यक छ' });
            return;
        }
        if (!validatePhone(phone)) {
            setErrors({ phone: language === 'en' ? 'Please enter a valid phone number' : 'कृपया मान्य फोन नम्बर प्रविष्ट गर्नुहोस्' });
            return;
        }

        setIsSendingOtp(true);
        try {
            // In a real app, this would trigger an API call to send OTP
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep('otp');
            Alert.alert(
                language === 'en' ? 'OTP Sent' : 'OTP पठाइयो',
                language === 'en' ? 'A 6-digit code has been sent to your phone' : 'तपाईंको फोनमा ६ अंकको कोड पठाइयो'
            );
        } catch (error: any) {
            setApiError(error.message || (language === 'en' ? 'Failed to send OTP' : 'OTP पठाउन सकिएन'));
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleOtpSubmit = async () => {
        setApiError('');
        if (!otp || otp.length !== 6) {
            setErrors({ otp: language === 'en' ? 'Please enter a valid 6-digit code' : 'कृपया मान्य ६ अंकको कोड प्रविष्ट गर्नुहोस्' });
            return;
        }

        setIsVerifyingOtp(true);
        try {
            // In a real app, this would verify the OTP and sign in
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 2000));
            await signIn(phone, 'auto-generated');
        } catch (error: any) {
            setApiError(error.message || (language === 'en' ? 'Invalid OTP' : 'अमान्य OTP'));
        } finally {
            setIsVerifyingOtp(false);
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
            case 'phone':
                return (
                    <View style={styles.inputContainer}>
                    <View>
                        <TextInput
                            style={[styles.input, errors.phone && styles.inputError]}
        placeholder={language === 'en' ? 'Phone Number' : 'फोन नम्बर'}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => {
            setPhone(text);
            if (errors.phone) {
                setErrors({ ...errors, phone: undefined });
            }
        }}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <TouchableOpacity
            style={styles.continueButton}
            onPress={handlePhoneSubmit}
            disabled={isSendingOtp}
                >
                {isSendingOtp ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.continueButtonText}>
                        {language === 'en' ? 'Send OTP' : 'OTP पठाउनुहोस्'}
                </Text>
        )}
            </TouchableOpacity>
            </View>
        );

        case 'otp':
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
            if (errors.otp) {
                setErrors({ ...errors, otp: undefined });
            }
        }}
            />
            {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
                </View>

                <TouchableOpacity
                style={styles.resendButton}
                onPress={handlePhoneSubmit}
                disabled={isSendingOtp}
                >
                <Text style={styles.resendButtonText}>
                {language === 'en' ? 'Resend OTP' : 'OTP पुनः पठाउनुहोस्'}
                </Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.continueButton}
                onPress={handleOtpSubmit}
                disabled={isVerifyingOtp}
                    >
                    {isVerifyingOtp ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.continueButtonText}>
                            {language === 'en' ? 'Verify OTP' : 'OTP प्रमाणित गर्नुहोस्'}
                    </Text>
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

        {renderStep()}

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
            resendButton: {
                alignItems: 'center',
                marginTop: 10,
            },
            resendButtonText: {
                color: '#007AFF',
                fontSize: 14,
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