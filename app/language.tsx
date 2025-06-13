import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { translations, useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelection() {
    const insets = useSafeAreaInsets();
    const { language, setLanguage } = useLanguage();

    const handleLanguageSelect = async (selectedLanguage: 'en' | 'ne') => {
        await setLanguage(selectedLanguage);
        router.replace('/(auth)/sign-in');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" />

            <View style={styles.content}>
                <Image
                    source={require('../assets/images/MedicMitra11-react4.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>{translations[language].welcome}</Text>
                <Text style={styles.subtitle}>{translations[language].subtitle}</Text>

                <Text style={styles.languageTitle}>{translations[language].selectLanguage}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, language === 'en' && styles.selectedButton]}
                        onPress={() => handleLanguageSelect('en')}
                    >
                        <Text style={[styles.buttonText, language === 'en' && styles.selectedButtonText]}>
                            {translations[language].english}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, language === 'ne' && styles.selectedButton]}
                        onPress={() => handleLanguageSelect('ne')}
                    >
                        <Text style={[styles.buttonText, language === 'ne' && styles.selectedButtonText]}>
                            {translations[language].nepali}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    languageTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    selectedButtonText: {
        color: '#fff',
    },
});