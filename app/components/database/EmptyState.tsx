import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '@/constants/Colors';
import { EmptyStateProps } from './types';

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                          type,
                                                          theme,
                                                          language,
                                                      }) => {
    const getTitle = () => {
        if (type === 'topic') {
            return language === 'en' ? 'No Topics Found' : 'कुनै विषय भेटिएन';
        }
        return language === 'en' ? 'No Medicines Found' : 'कुनै औषधि भेटिएन';
    };

    const getDescription = () => {
        if (type === 'topic') {
            return language === 'en'
                ? 'Search for topics by name'
                : 'नाम द्वारा विषय खोज्नुहोस्';
        }
        return language === 'en'
            ? 'Search for medicines by name or generic name'
            : 'नाम वा जेनेरिक नाम द्वारा औषधि खोज्नुहोस्';
    };

    return (
        <View style={styles.emptyState}>
            <Ionicons
                name="search-outline"
                size={64}
                color={theme.colors.text}
                style={styles.emptyStateIcon}
            />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
                {getTitle()}
            </Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
                {getDescription()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        marginTop: Spacing.xl * 2,
    },
    emptyStateIcon: {
        opacity: 0.5,
        marginBottom: Spacing.lg,
    },
    emptyStateTitle: {
        ...Typography.h2,
        fontSize: 20,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    emptyStateText: {
        ...Typography.body1,
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
});