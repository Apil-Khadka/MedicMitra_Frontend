import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors, Typography } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HistoryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { language } = useLanguage();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                {language === 'en' ? 'History' : 'इतिहास'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        ...Typography.h1,
    },
});