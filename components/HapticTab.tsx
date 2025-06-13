import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../constants/Colors';
import ThemedText from './ThemedText';

interface HapticTabProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    isActive?: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

export default function HapticTab({
                                      icon,
                                      label,
                                      isActive = false,
                                      onPress,
                                      style,
                                  }: HapticTabProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: isActive ? colors.primary : 'transparent',
                    borderColor: isActive ? colors.primary : colors.border,
                },
                style,
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={24}
                color={isActive ? colors.buttonText : colors.text}
                style={styles.icon}
            />
            <ThemedText
                variant="button"
                color={isActive ? 'buttonText' : 'text'}
                style={styles.label}
            >
                {label}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        gap: Spacing.sm,
    },
    icon: {
        marginRight: Spacing.xs,
    },
    label: {
        ...Typography.button,
    },
});
