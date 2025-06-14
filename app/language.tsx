import { useAuth } from '@/contexts/AuthContext';
import { Language, translations, useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../components/ThemedText';
import { BorderRadius, Colors, Shadows, Spacing } from '../constants/Colors';

export default function LanguageSelection() {
    const insets = useSafeAreaInsets();
    const { language, setLanguage } = useLanguage();
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [defaultLanguage] = useState<Language>('en');

    const handleLanguageSelect = async (lang: Language) => {
        try {
            setIsLoading(true);
            await setLanguage(lang);
            // Small delay to ensure language is saved and context is updated
            await new Promise(resolve => setTimeout(resolve, 100));

            if (user) {
                router.replace('/(tabs)');
            } else {
                router.replace('/sign-in');
            }
        } catch (error) {
            console.error('Error setting language:', error);
            Alert.alert('Error', 'Failed to set language. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <Animated.View
                entering={FadeInDown.duration(600).springify()}
                style={styles.content}
            >
                <Animated.View
                    entering={FadeInUp.delay(200).duration(600).springify()}
                    style={styles.logoContainer}
                >
                    <Image
                        source={require('../assets/images/MedicMitra11-react4.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(400).duration(600).springify()}
                    style={styles.textContainer}
                >
                    <ThemedText variant="h1" color="text" style={styles.title}>
                        {translations[defaultLanguage].welcome}
                    </ThemedText>
                    <ThemedText variant="body1" color="textSecondary" style={styles.subtitle}>
                        {translations[defaultLanguage].subtitle}
                    </ThemedText>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(600).duration(600).springify()}
                    style={styles.languageContainer}
                >
                    <ThemedText variant="h3" color="text" style={styles.languageTitle}>
                        {translations[defaultLanguage].selectLanguage}
                    </ThemedText>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'en' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'en' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle,
                                { opacity: isLoading ? 0.7 : 1 }
                            ]}
                            onPress={() => handleLanguageSelect('en')}
                            disabled={isLoading}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'en' ? 'buttonText' : 'text'}
                            >
                                English
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'ne' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'ne' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle,
                                { opacity: isLoading ? 0.7 : 1 }
                            ]}
                            onPress={() => handleLanguageSelect('ne')}
                            disabled={isLoading}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'ne' ? 'buttonText' : 'text'}
                            >
                                नेपाली
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'bh' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'bh' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle,
                                { opacity: isLoading ? 0.7 : 1 }
                            ]}
                            onPress={() => handleLanguageSelect('bh')}
                            disabled={isLoading}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'bh' ? 'buttonText' : 'text'}
                            >
                                भोजपुरी
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'mai' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'mai' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle,
                                { opacity: isLoading ? 0.7 : 1 }
                            ]}
                            onPress={() => handleLanguageSelect('mai')}
                            disabled={isLoading}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'mai' ? 'buttonText' : 'text'}
                            >
                                मैथिली
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.xl,
    },
    logoContainer: {
        width: '100%',
        aspectRatio: 2,
        marginBottom: Spacing.xl,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
    },
    languageContainer: {
        width: '100%',
        gap: Spacing.lg,
    },
    languageTitle: {
        textAlign: 'center',
    },
    buttonContainer: {
        gap: Spacing.md,
    },
    languageButton: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        alignItems: 'center',
        ...Shadows.sm,
    },
    languageButtonActive: {
        ...Shadows.md,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});