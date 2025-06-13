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

interface FormErrors {
    email?: string;
    password?: string;
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
    forgotPassword: ViewStyle;
    forgotPasswordText: TextStyle;
    signInButton: ViewStyle;
    signInButtonText: TextStyle;
    signUpContainer: ViewStyle;
    signUpText: TextStyle;
    signUpLink: TextStyle;
    passwordContainer: ViewStyle;
    passwordInput: TextStyle;
    visibilityToggle: ViewStyle;
}

export default function SignInEmail() {
    const insets = useSafeAreaInsets();
    const { signIn } = useAuth();
    const { language, translations: t } = useLanguage();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        if (!validateForm()) return;

        setIsVerifying(true);
        setApiError('');

        try {
            await signIn(email, password);
        } catch (error) {
            setApiError(language === 'en' ? 'Invalid email or password' : 'अमान्य इमेल वा पासवर्ड');
        } finally {
            setIsVerifying(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                                <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
                            ) : null}
                        </View>

                        <View>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.passwordInput,
                                        {
                                            backgroundColor: colors.inputBackground,
                                            borderColor: errors.password ? colors.error : colors.inputBorder,
                                            color: colors.text
                                        }
                                    ]}
                                    placeholder={t[language].password}
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoComplete="password"
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
                                <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>
                            ) : null}
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                                {t[language].forgotPassword}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.signInButton,
                                { backgroundColor: colors.buttonPrimary },
                                isVerifying && { opacity: 0.7 }
                            ]}
                            onPress={handleSignIn}
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color={colors.buttonText} />
                            ) : (
                                <Text style={[styles.signInButtonText, { color: colors.buttonText }]}>
                                    {t[language].signIn}
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: Spacing.md,
    },
    forgotPasswordText: {
        ...Typography.body2,
    },
    signInButton: {
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        marginTop: Spacing.xl,
        ...Shadows.sm,
    },
    signInButtonText: {
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
}); 