import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface FormErrors {
    phone?: string;
    otp?: string;
}

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    title: TextStyle;
    content: ViewStyle;
    inputContainer: ViewStyle;
    input: TextStyle;
    inputError: TextStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
    continueButton: ViewStyle;
    continueButtonText: TextStyle;
    signUpContainer: ViewStyle;
    signUpText: TextStyle;
    signUpLink: TextStyle;
}

type SignInStep = 'phone' | 'otp';

export default function SignInPhone() {
    const insets = useSafeAreaInsets();
    const { signIn } = useAuth();
    const { language, translations: t } = useLanguage();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [step, setStep] = useState<SignInStep>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);

    const validatePhone = (phone: string): boolean => {
        // Basic phone validation - can be enhanced based on requirements
        return /^\+?[\d\s-]{10,}$/.test(phone);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (step === 'phone') {
            if (!phone.trim()) {
                newErrors.phone = language === 'en' ? 'Phone number is required' : 'फोन नम्बर आवश्यक छ';
            } else if (!validatePhone(phone)) {
                newErrors.phone = language === 'en' ? 'Please enter a valid phone number' : 'कृपया मान्य फोन नम्बर प्रविष्ट गर्नुहोस्';
            }
        } else {
            if (!otp || otp.length !== 6) {
                newErrors.otp = language === 'en' ? 'Please enter a valid 6-digit code' : 'कृपया मान्य ६ अंकको कोड प्रविष्ट गर्नुहोस्';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhoneSubmit = async () => {
        if (!validateForm()) return;

        setIsVerifying(true);
        setApiError('');

        try {
            // In a real app, this would trigger an API call to send OTP
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStep('otp');
        } catch (error) {
            setApiError(language === 'en' ? 'Failed to send OTP' : 'OTP पठाउन सकिएन');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleOtpSubmit = async () => {
        if (!validateForm()) return;

        setIsVerifying(true);
        setApiError('');

        try {
            // In a real app, this would verify the OTP and sign in
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1000));
            await signIn(phone, 'auto-generated');
        } catch (error) {
            setApiError(language === 'en' ? 'Invalid OTP' : 'अमान्य OTP');
        } finally {
            setIsVerifying(false);
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
            <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

                <Animated.View
                    entering={FadeInDown.duration(600).springify()}
                    style={styles.header}
                >
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>{t[language].signIn}</Text>
                </Animated.View>

                <View style={styles.content}>
                    {apiError ? (
                        <Animated.View
                            entering={FadeInDown.duration(400)}
                            style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}
                        >
                            <Text style={[styles.errorText, { color: colors.error }]}>{apiError}</Text>
                        </Animated.View>
                    ) : null}

                    <Animated.View
                        entering={FadeInUp.delay(200).duration(600).springify()}
                        style={styles.inputContainer}
                    >
                        {step === 'phone' ? (
                            <View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: colors.inputBackground,
                                            borderColor: errors.phone ? colors.error : colors.inputBorder,
                                            color: colors.text
                                        }
                                    ]}
                                    placeholder={language === 'en' ? 'Phone Number' : 'फोन नम्बर'}
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                    autoComplete="tel"
                                />
                                {errors.phone ? (
                                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.phone}</Text>
                                ) : null}
                            </View>
                        ) : (
                            <View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: colors.inputBackground,
                                            borderColor: errors.otp ? colors.error : colors.inputBorder,
                                            color: colors.text
                                        }
                                    ]}
                                    placeholder={language === 'en' ? 'Enter 6-digit code' : '६ अंकको कोड प्रविष्ट गर्नुहोस्'}
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    value={otp}
                                    onChangeText={setOtp}
                                />
                                {errors.otp ? (
                                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.otp}</Text>
                                ) : null}
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                { backgroundColor: colors.buttonPrimary },
                                isVerifying && { opacity: 0.7 }
                            ]}
                            onPress={step === 'phone' ? handlePhoneSubmit : handleOtpSubmit}
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color={colors.buttonText} />
                            ) : (
                                <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
                                    {t[language].continue}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(400).duration(600).springify()}
                        style={styles.signUpContainer}
                    >
                        <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                            {language === 'en' ? "Don't have an account? " : 'खाता छैन? '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up' as any)}>
                            <Text style={[styles.signUpLink, { color: colors.primary }]}>{t[language].signUp}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
    },
    backButton: {
        marginRight: Spacing.md,
    },
    title: {
        ...Typography.h1,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    inputContainer: {
        gap: Spacing.md,
    },
    input: {
        ...Typography.body1,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    inputError: {
        borderColor: Colors.light.error,
    },
    errorContainer: {
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.lg,
    },
    errorText: {
        ...Typography.caption,
        marginTop: Spacing.xs,
    },
    continueButton: {
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        marginTop: Spacing.xl,
        ...Shadows.sm,
    },
    continueButtonText: {
        ...Typography.button,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingBottom: Spacing.xl,
    },
    signUpText: {
        ...Typography.body2,
    },
    signUpLink: {
        ...Typography.body2,
        fontWeight: '600',
    },
});