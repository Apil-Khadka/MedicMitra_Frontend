import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../constants/Colors';
import ThemedText from './ThemedText';

interface ExternalLinkProps {
    href: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

export default function ExternalLink({ href, children, style }: ExternalLinkProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={() => Linking.openURL(href)}
            activeOpacity={0.7}
        >
            <ThemedText
                variant="body2"
                color="primary"
                style={styles.text}
            >
                {children}
            </ThemedText>
            <Ionicons
                name="open-outline"
                size={16}
                color={colors.primary}
                style={styles.icon}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    text: {
        textDecorationLine: 'underline',
    },
    icon: {
        marginTop: 2,
    },
});
