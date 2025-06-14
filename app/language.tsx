import { translations, useLanguage } from '@/contexts/LanguageContext';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../components/ThemedText';
import { BorderRadius, Colors, Shadows, Spacing } from '../constants/Colors';

export default function LanguageSelection() {
    const insets = useSafeAreaInsets();
    const { language, setLanguage } = useLanguage();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleLanguageSelect = async (selectedLanguage: 'en' | 'ne' | 'bh' | 'mai') => {
        await setLanguage(selectedLanguage);
        router.replace('/(auth)/sign-in');
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
                        {translations[language].welcome}
                    </ThemedText>
                    <ThemedText variant="body1" color="textSecondary" style={styles.subtitle}>
                        {translations[language].subtitle}
                    </ThemedText>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(600).duration(600).springify()}
                    style={styles.languageContainer}
                >
                    <ThemedText variant="h3" color="text" style={styles.languageTitle}>
                        {translations[language].selectLanguage}
                    </ThemedText>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'en' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'en' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle
                            ]}
                            onPress={() => handleLanguageSelect('en')}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'en' ? 'buttonText' : 'text'}
                            >
                                {translations[language].english}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'ne' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'ne' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle
                            ]}
                            onPress={() => handleLanguageSelect('ne')}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'ne' ? 'buttonText' : 'text'}
                            >
                                {translations[language].nepali}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'bh' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'bh' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle
                            ]}
                            onPress={() => handleLanguageSelect('bh')}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'bh' ? 'buttonText' : 'text'}
                            >
                                {translations[language].bhojpuri}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                language === 'mai' && styles.languageButtonActive,
                                {
                                    backgroundColor: language === 'mai' ? colors.primary : colors.card,
                                    borderColor: colors.border,
                                } as ViewStyle
                            ]}
                            onPress={() => handleLanguageSelect('mai')}
                        >
                            <ThemedText
                                variant="button"
                                color={language === 'mai' ? 'buttonText' : 'text'}
                            >
                                {translations[language].maithili}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
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
});