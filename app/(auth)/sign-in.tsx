import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

type SignInMethod = 'email' | 'phone';

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    content: ViewStyle;
    methodContainer: ViewStyle;
    methodButton: ViewStyle;
    iconContainer: ViewStyle;
    methodTextContainer: ViewStyle;
    methodButtonText: TextStyle;
    methodButtonSubtext: TextStyle;
    signUpContainer: ViewStyle;
    signUpText: TextStyle;
    signUpLink: TextStyle;
    dividerContainer: ViewStyle;
    divider: ViewStyle;
    dividerText: TextStyle;
    socialButtonsContainer: ViewStyle;
    socialButton: ViewStyle;
    socialButtonIcon: ViewStyle;
    socialButtonText: TextStyle;
}

export default function SignIn() {
    const insets = useSafeAreaInsets();
    const { language, translations: t } = useLanguage();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleMethodSelect = (method: SignInMethod) => {
        router.push(method === 'email' ? '/(auth)/sign-in-email' : '/(auth)/sign-in-phone' as any);
    };

    const handleGoogleSignIn = () => {
        // TODO: Implement Google sign-in
        console.log('Google sign-in pressed');
    };

    const handleGithubSignIn = () => {
        // TODO: Implement GitHub sign-in
        console.log('GitHub sign-in pressed');
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
                    <Text style={[styles.title, { color: colors.text }]}>{t[language].signIn}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {language === 'en' ? 'Welcome back! Please sign in to continue.' : 'पुनः स्वागत छ! कृपया जारी राख्न साइन इन गर्नुहोस्।'}
                    </Text>
                </Animated.View>

                <View style={styles.content}>
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(600).springify()}
                        style={styles.methodContainer}
                    >
                        <TouchableOpacity
                            style={[styles.methodButton, { backgroundColor: colors.card }]}
                            onPress={() => handleMethodSelect('email')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                                <Ionicons name="mail" size={24} color={colors.buttonText} />
                            </View>
                            <View style={styles.methodTextContainer}>
                                <Text style={[styles.methodButtonText, { color: colors.text }]}>
                                    {language === 'en' ? 'Sign in with Email' : 'इमेलबाट साइन इन गर्नुहोस्'}
                                </Text>
                                <Text style={[styles.methodButtonSubtext, { color: colors.textSecondary }]}>
                                    {language === 'en' ? 'Use your email and password' : 'आफ्नो इमेल र पासवर्ड प्रयोग गर्नुहोस्'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.methodButton, { backgroundColor: colors.card }]}
                            onPress={() => handleMethodSelect('phone')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                                <Ionicons name="phone-portrait" size={24} color={colors.buttonText} />
                            </View>
                            <View style={styles.methodTextContainer}>
                                <Text style={[styles.methodButtonText, { color: colors.text }]}>
                                    {language === 'en' ? 'Sign in with Phone' : 'फोनबाट साइन इन गर्नुहोस्'}
                                </Text>
                                <Text style={[styles.methodButtonSubtext, { color: colors.textSecondary }]}>
                                    {language === 'en' ? 'Use your phone number' : 'आफ्नो फोन नम्बर प्रयोग गर्नुहोस्'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(400).duration(600).springify()}
                        style={styles.dividerContainer}
                    >
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                            {language === 'en' ? 'or continue with' : 'वा यसबाट जारी राख्नुहोस्'}
                        </Text>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(600).duration(600).springify()}
                        style={styles.socialButtonsContainer}
                    >
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: colors.card }]}
                            onPress={handleGoogleSignIn}
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
                            onPress={handleGithubSignIn}
                        >
                            <Animated.View style={[styles.socialButtonIcon, animatedGithubStyle]}>
                                <Ionicons name="logo-github" size={24} color={colors.text} />
                            </Animated.View>
                            <Text style={[styles.socialButtonText, { color: colors.text }]}>
                                {language === 'en' ? 'GitHub' : 'गिटहब'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(800).duration(600).springify()}
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
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        gap: Spacing.xs,
    },
    title: {
        ...Typography.h1,
    },
    subtitle: {
        ...Typography.body2,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    methodContainer: {
        gap: Spacing.md,
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        ...Shadows.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    methodTextContainer: {
        flex: 1,
        gap: Spacing.xs,
    },
    methodButtonText: {
        ...Typography.body1,
        fontWeight: '600',
    },
    methodButtonSubtext: {
        ...Typography.caption,
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