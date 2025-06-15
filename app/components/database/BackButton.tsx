import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Spacing, Typography } from '@/constants/Colors';
import { BackButtonProps } from './types';

export const BackButton: React.FC<BackButtonProps> = ({
                                                          title,
                                                          onPress,
                                                          theme,
                                                      }) => {
    return (
        <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.card }]}
            onPress={onPress}
        >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            <Text style={[styles.backButtonText, { color: theme.colors.text }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        borderRadius: 8,
        marginBottom: Spacing.sm,
    },
    backButtonText: {
        ...Typography.body1,
        marginLeft: Spacing.sm,
        fontSize: 16,
    },
});