import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

type SignUpStep = 'email' | 'password' | 'name';

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
}

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    content: ViewStyle;
    inputContainer: ViewStyle;
    input: TextStyle;
    inputError: TextStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
    continueButton: ViewStyle;
    continueButtonText: TextStyle;
    signInContainer: ViewStyle;
    signInText: TextStyle;
    signInLink: TextStyle;
    emailContainer: ViewStyle;
    emailText: TextStyle;
    emailIcon: ViewStyle;
    changeEmailButton: ViewStyle;
    changeEmailButtonText: TextStyle;
    nameContainer: ViewStyle;
    nameInputContainer: ViewStyle;
    skipButton: ViewStyle;
    skipButtonText: TextStyle;
    passwordContainer: ViewStyle;
    passwordInput: TextStyle;
    visibilityToggle: ViewStyle;
    dividerContainer: ViewStyle;
    divider: ViewStyle;
    dividerText: TextStyle;
    socialButtonsContainer: ViewStyle;
    socialButton: ViewStyle;
    socialButtonIcon: ViewStyle;
    socialButtonText: TextStyle;
}

export default function SignUp() {
    const insets = useSafeAreaInsets();
    const { signUp } = useAuth();
    const { language, translations: t } = useLanguage();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [step, setStep] = useState<SignUpStep>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateEmail = (): boolean => {
        const newErrors: FormErrors = {};
        if (!email.trim()) {
            newErrors.email = language === 'en' ? 'Email is required' : 'इमेल आवश्यक छ';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = (): boolean => {
        const newErrors: FormErrors = {};
        if (!password) {
            newErrors.password = language === 'en' ? 'Password is required' : 'पासवर्ड आवश्यक छ';
        } else if (password.length < 6) {
            newErrors.password = language === 'en' ? 'Password must be at least 6 characters' : 'पासवर्ड कम्तिमा ६ वर्णको हुनुपर्छ';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = language === 'en' ? 'Please confirm your password' : 'कृपया आफ्नो पासवर्ड पुष्टि गर्नुहोस्';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = language === 'en' ? 'Passwords do not match' : 'पासवर्डहरू मेल खाँदैनन्';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateName = (): boolean => {
        const newErrors: FormErrors = {};
        if (!firstName.trim()) {
            newErrors.firstName = language === 'en' ? 'First name is required' : 'पहिलो नाम आवश्यक छ';
        }
        if (!lastName.trim()) {
            newErrors.lastName = language === 'en' ? 'Last name is required' : 'थर आवश्यक छ';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailSubmit = async () => {
        if (!validateEmail()) return;
        setStep('password');
    };

    const handlePasswordSubmit = async () => {
        if (!validatePassword()) return;
        setStep('name');
    };

    const handleNameSubmit = async () => {
        if (!validateName()) return;

        setIsVerifying(true);
        setApiError('');

        try {
            await signUp(email, password, firstName, lastName);
        } catch (error) {
            setApiError(language === 'en' ? 'Failed to create account' : 'खाता सिर्जना गर्न सकिएन');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSkipName = async () => {
        setIsVerifying(true);
        setApiError('');

        try {
            await signUp(email, password, '', '');
        } catch (error) {
            setApiError(language === 'en' ? 'Failed to create account' : 'खाता सिर्जना गर्न सकिएन');
        } finally {
            setIsVerifying(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(showPassword ? 1.2 : 1, {
                        damping: 10,
                        stiffness: 100,
                    }),
                },
            ],
        };
    });

    const animatedConfirmIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(showConfirmPassword ? 1.2 : 1, {
                        damping: 10,
                        stiffness: 100,
                    }),
                },
            ],
        };
    });

    const handleGoogleSignUp = () => {
        // TODO: Implement Google sign-up
        console.log('Google sign-up pressed');
    };

    const handleGithubSignUp = () => {
        // TODO: Implement GitHub sign-up
        console.log('GitHub sign-up pressed');
    };

    const animatedGoogleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(1, {
                        damping: 10,
                        stiffness: 100,
                    }),
                },
            ],
        };
    });

    const animatedGithubStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(1, {
                        damping: 10,
                        stiffness: 100,
                    }),
                },
            ],
        };
    });

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(600).springify()}
                        exiting={FadeInDown.duration(400)}
                        style={styles.inputContainer}
                    >
                        <View>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.inputBackground,
                                        borderColor: errors.email ? colors.error : colors.inputBorder,
                                        color: colors.text
                                    }
                                ]}
                                placeholder={t[language].email}
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                            {errors.email ? (
                                <Animated.Text
                                    entering={FadeInDown.duration(200)}
                                    style={[styles.errorText, { color: colors.error }]}
                                >
                                    {errors.email}
                                </Animated.Text>
                            ) : null}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                { backgroundColor: colors.buttonPrimary }
                            ]}
                            onPress={handleEmailSubmit}
                        >
                            <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
                                {t[language].continue}
                            </Text>
                        </TouchableOpacity>

                        <Animated.View
                            entering={FadeInUp.delay(400).duration(600).springify()}
                            style={styles.dividerContainer}
                        >
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                                {language === 'en' ? 'or sign up with' : 'वा यसबाट साइन अप गर्नुहोस्'}
                            </Text>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(600).duration(600).springify()}
                            style={styles.socialButtonsContainer}
                        >
                            <TouchableOpacity
                                style={[styles.socialButton, { backgroundColor: colors.card }]}
                                onPress={handleGoogleSignUp}
                            >
                                <Animated.View style={[styles.socialButtonIcon, animatedGoogleStyle]}>
                                    <Ionicons name="logo-google" size={24} color={colors.text} />
                                </Animated.View>
                                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                                    {language === 'en' ? 'Google' : 'गुगल'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.socialButton, { backgroundColor: colors.card }]}
                                onPress={handleGithubSignUp}
                            >
                                <Animated.View style={[styles.socialButtonIcon, animatedGithubStyle]}>
                                    <Ionicons name="logo-github" size={24} color={colors.text} />
                                </Animated.View>
                                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                                    {language === 'en' ? 'GitHub' : 'गिटहब'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                );

            case 'password':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(600).springify()}
                        exiting={FadeInDown.duration(400)}
                        style={styles.inputContainer}
                    >
                        <Animated.View
                            entering={FadeInDown.delay(100).duration(400)}
                            style={[
                                styles.emailContainer,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border
                                }
                            ]}
                        >
                            <Text style={[styles.emailText, { color: colors.text }]}>{email}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.changeEmailButton,
                                    {
                                        backgroundColor: colors.background,
                                        borderColor: colors.primary
                                    }
                                ]}
                                onPress={() => setStep('email')}
                            >
                                <Text style={[styles.changeEmailButtonText, { color: colors.primary }]}>
                                    {language === 'en' ? 'Change' : 'परिवर्तन गर्नुहोस्'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.passwordInput,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: errors.password ? colors.error : colors.border,
                                            color: colors.text
                                        }
                                    ]}
                                    placeholder={t[language].password}
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoComplete="password-new"
                                />
                                <TouchableOpacity
                                    style={styles.visibilityToggle}
                                    onPress={togglePasswordVisibility}
                                >
                                    <Animated.View style={animatedIconStyle}>
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={24}
                                            color={colors.textSecondary}
                                        />
                                    </Animated.View>
                                </TouchableOpacity>
                            </View>
                            {errors.password ? (
                                <Animated.Text
                                    entering={FadeInDown.duration(200)}
                                    style={[styles.errorText, { color: colors.error }]}
                                >
                                    {errors.password}
                                </Animated.Text>
                            ) : null}
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.passwordInput,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: errors.confirmPassword ? colors.error : colors.border,
                                            color: colors.text
                                        }
                                    ]}
                                    placeholder={t[language].confirmPassword}
                                    placeholderTextColor={colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoComplete="password-new"
                                />
                                <TouchableOpacity
                                    style={styles.visibilityToggle}
                                    onPress={toggleConfirmPasswordVisibility}
                                >
                                    <Animated.View style={animatedConfirmIconStyle}>
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                            size={24}
                                            color={colors.textSecondary}
                                        />
                                    </Animated.View>
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword ? (
                                <Animated.Text
                                    entering={FadeInDown.duration(200)}
                                    style={[styles.errorText, { color: colors.error }]}
                                >
                                    {errors.confirmPassword}
                                </Animated.Text>
                            ) : null}
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(400).duration(400)}
                            style={{ marginTop: Spacing.xl }}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.continueButton,
                                    { backgroundColor: colors.buttonPrimary }
                                ]}
                                onPress={handlePasswordSubmit}
                            >
                                <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
                                    {t[language].continue}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                );

            case 'name':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(600).springify()}
                        exiting={FadeInDown.duration(400)}
                        style={styles.inputContainer}
                    >
                        <Animated.Text
                            entering={FadeInDown.delay(100).duration(400)}
                            style={[styles.title, { color: colors.text, marginBottom: Spacing.lg }]}
                        >
                            {language === 'en' ? 'Would you like to introduce yourself?' : 'आफ्नो परिचय दिन चाहनुहुन्छ?'}
                        </Animated.Text>

                        <Animated.View
                            entering={FadeInUp.delay(200).duration(400)}
                            style={styles.nameContainer}
                        >
                            <Animated.View
                                entering={FadeInUp.delay(200).duration(400)}
                                style={styles.nameInputContainer}
                            >
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: errors.firstName ? colors.error : colors.border,
                                            color: colors.text
                                        }
                                    ]}
                                    placeholder={t[language].firstName}
                                    placeholderTextColor={colors.textSecondary}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    autoCapitalize="words"
                                    autoComplete="given-name"
                                />
                                {errors.firstName ? (
                                    <Animated.Text
                                        entering={FadeInDown.duration(200)}
                                        style={[styles.errorText, { color: colors.error }]}
                                    >
                                        {errors.firstName}
                                    </Animated.Text>
                                ) : null}
                            </Animated.View>

                            <Animated.View
                                entering={FadeInUp.delay(300).duration(400)}
                                style={styles.nameInputContainer}
                            >
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: errors.lastName ? colors.error : colors.border,
                                            color: colors.text
                                        }
                                    ]}
                                    placeholder={t[language].lastName}
                                    placeholderTextColor={colors.textSecondary}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    autoCapitalize="words"
                                    autoComplete="family-name"
                                />
                                {errors.lastName ? (
                                    <Animated.Text
                                        entering={FadeInDown.duration(200)}
                                        style={[styles.errorText, { color: colors.error }]}
                                    >
                                        {errors.lastName}
                                    </Animated.Text>
                                ) : null}
                            </Animated.View>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(400).duration(400)}
                            style={{ marginTop: Spacing.xl }}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.continueButton,
                                    { backgroundColor: colors.buttonPrimary },
                                    isVerifying && { opacity: 0.7 }
                                ]}
                                onPress={handleNameSubmit}
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
                            entering={FadeInUp.delay(500).duration(400)}
                            style={styles.skipButton}
                        >
                            <TouchableOpacity
                                onPress={handleSkipName}
                                disabled={isVerifying}
                            >
                                <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                                    {language === 'en' ? 'Skip for now' : 'अहिलेलाई छोड्नुहोस्'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                );
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
                    <Text style={[styles.title, { color: colors.text }]}>{t[language].signUp}</Text>
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

                    {renderStep()}

                    <Animated.View
                        entering={FadeInUp.delay(400).duration(600).springify()}
                        style={styles.signInContainer}
                    >
                        <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                            {language === 'en' ? 'Already have an account? ' : 'पहिले नै खाता छ? '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in' as any)}>
                            <Text style={[styles.signInLink, { color: colors.primary }]}>{t[language].signIn}</Text>
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
    subtitle: {
        ...Typography.body2,
        color: Colors.light.textSecondary,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    inputContainer: {
        gap: Spacing.md,
    },
    nameContainer: {
        gap: Spacing.md,
    },
    nameInputContainer: {
        width: '100%',
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
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingBottom: Spacing.xl,
    },
    signInText: {
        ...Typography.body2,
    },
    signInLink: {
        ...Typography.body2,
        fontWeight: '600',
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
    },
    emailText: {
        ...Typography.body1,
        flex: 1,
        marginRight: Spacing.md,
        opacity: 0.8,
    },
    emailIcon: {
        width: 24,
        height: 24,
        marginRight: Spacing.sm,
    },
    changeEmailButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.light.card,
    },
    changeEmailButtonText: {
        ...Typography.body2,
        color: Colors.light.primary,
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    skipButtonText: {
        ...Typography.body2,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 48, // Make room for the icon
    },
    visibilityToggle: {
        position: 'absolute',
        right: Spacing.md,
        top: '50%',
        transform: [{ translateY: -12 }],
        padding: Spacing.xs,
        zIndex: 1,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.xl,
        gap: Spacing.md,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        ...Typography.caption,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
        ...Shadows.sm,
    },
    socialButtonIcon: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialButtonText: {
        ...Typography.button,
    },
});