import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, {
    cancelAnimation,
    FadeInDown,
    FadeInUp,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
    logoContainer: ViewStyle;
    logo: ViewStyle;
}

export default function SignIn() {
    const insets = useSafeAreaInsets();
    const { language } = useLanguage();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const scale = useSharedValue(1);
    const buttonScale = useSharedValue(1);

    const handleEmailSignIn = () => {
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 12, stiffness: 300 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
        setTimeout(() => {
            router.push('/(auth)/sign-in-email' as any);
        }, 150);
    };

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
            backgroundColor: interpolateColor(
                buttonScale.value,
                [0.95, 1],
                [colors.primary + '20', colors.card]
            ),
        };
    });

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const animateLogo = useCallback(() => {
        // Cancel any ongoing animation
        cancelAnimation(scale);
        // Reset to initial state
        scale.value = 1;
        // Start welcome animation
        scale.value = withSequence(
            withSpring(1.1, { damping: 10, stiffness: 300 }),
            withSpring(1, { damping: 12, stiffness: 300 })
        );
    }, []);

    React.useEffect(() => {
        animateLogo();
    }, [animateLogo]);

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
                    entering={FadeInDown.duration(500).springify()}
                    style={styles.header}
                >
                    <Animated.View
                        style={[styles.logoContainer, animatedLogoStyle]}
                        entering={FadeInDown.delay(100).duration(500).springify()}
                    >
                        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                            <Ionicons name="medical" size={32} color={colors.buttonText} />
                        </View>
                    </Animated.View>
                    <Animated.Text
                        entering={FadeInDown.delay(200).duration(500).springify()}
                        style={[styles.title, { color: colors.text }]}
                    >
                        {language === 'en' ? 'Welcome Back' : 'पुनः स्वागत छ'}
                    </Animated.Text>
                    <Animated.Text
                        entering={FadeInDown.delay(300).duration(500).springify()}
                        style={[styles.subtitle, { color: colors.textSecondary }]}
                    >
                        {language === 'en' ? 'Sign in to continue' : 'जारी राख्न साइन इन गर्नुहोस्'}
                    </Animated.Text>
                </Animated.View>

                <View style={styles.content}>
                    <Animated.View
                        entering={FadeInUp.delay(400).duration(500).springify()}
                        style={styles.methodContainer}
                    >
                        <AnimatedPressable
                            style={[styles.methodButton, animatedButtonStyle]}
                            onPress={handleEmailSignIn}
                            android_ripple={{ color: colors.primary + '20', radius: 200 }}
                        >
                            <Animated.View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: colors.primary },
                                    useAnimatedStyle(() => ({
                                        transform: [{ scale: withSpring(buttonScale.value * 1.1) }]
                                    }))
                                ]}
                            >
                                <Ionicons name="mail" size={24} color={colors.buttonText} />
                            </Animated.View>
                            <View style={styles.methodTextContainer}>
                                <Text style={[styles.methodButtonText, { color: colors.text }]}>
                                    {language === 'en' ? 'Sign in with Email' : 'इमेलबाट साइन इन गर्नुहोस्'}
                                </Text>
                                <Text style={[styles.methodButtonSubtext, { color: colors.textSecondary }]}>
                                    {language === 'en' ? 'Use your email and password' : 'आफ्नो इमेल र पासवर्ड प्रयोग गर्नुहोस्'}
                                </Text>
                            </View>
                        </AnimatedPressable>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(500).duration(500).springify()}
                        style={styles.signUpContainer}
                    >
                        <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                            {language === 'en' ? "Don't have an account? " : 'खाता छैन? '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/sign-up')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.signUpLink, { color: colors.primary }]}>
                                {language === 'en' ? 'Sign up' : 'साइन अप गर्नुहोस्'}
                            </Text>
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
        paddingVertical: Spacing.xl,
        gap: Spacing.md,
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: Spacing.md,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.lg,
    },
    title: {
        ...Typography.h1,
        textAlign: 'center',
        fontSize: 32,
    },
    subtitle: {
        ...Typography.body1,
        textAlign: 'center',
        opacity: 0.8,
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
        borderRadius: BorderRadius.xl,
        ...Shadows.lg,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.lg,
        ...Shadows.md,
    },
    methodTextContainer: {
        flex: 1,
        gap: Spacing.xs,
    },
    methodButtonText: {
        ...Typography.h2,
        fontSize: 20,
    },
    methodButtonSubtext: {
        ...Typography.body2,
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
        fontWeight: '700',
    },
});