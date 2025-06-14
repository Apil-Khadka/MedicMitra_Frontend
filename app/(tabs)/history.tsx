import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Typography } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

interface HistoryItem {
    id: string;
    medicineName: string;
    timestamp: string;
    status: 'success' | 'error';
}

export default function HistoryScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            padding: Spacing.lg,
            paddingTop: Spacing.xl,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            ...Typography.h1,
            fontSize: 24,
            color: theme.colors.text,
        },
        clearButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: Spacing.sm,
        },
        clearButtonText: {
            ...Typography.button,
            color: theme.colors.primary,
            marginLeft: Spacing.xs,
        },
        listContent: {
            padding: Spacing.lg,
            paddingTop: 0,
        },
        historyItem: {
            padding: Spacing.lg,
            borderRadius: 12,
            marginBottom: Spacing.md,
            backgroundColor: theme.colors.card,
            elevation: 2,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        historyHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.xs,
        },
        medicineName: {
            ...Typography.h3,
            fontSize: 18,
            color: theme.colors.text,
            flex: 1,
        },
        timestamp: {
            ...Typography.caption,
            fontSize: 12,
            color: theme.colors.text,
            opacity: 0.6,
        },
        statusContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: Spacing.xs,
        },
        statusIcon: {
            marginRight: Spacing.xs,
        },
        statusText: {
            ...Typography.caption,
            fontSize: 12,
        },
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
            color: theme.colors.text,
            marginBottom: Spacing.sm,
            textAlign: 'center',
        },
        emptyStateText: {
            ...Typography.body1,
            fontSize: 16,
            color: theme.colors.text,
            textAlign: 'center',
            opacity: 0.7,
        },
    });

    const handleClearHistory = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement clear history functionality
            setHistoryItems([]);
        } catch (error) {
            console.error('Error clearing history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons
                name="time-outline"
                size={64}
                color={theme.colors.text}
                style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>
                {language === 'en' ? 'No History Yet' : 'अहिलेसम्म कुनै इतिहास छैन'}
            </Text>
            <Text style={styles.emptyStateText}>
                {language === 'en'
                    ? 'Your scanned medicines will appear here'
                    : 'तपाईंले स्क्यान गरेका औषधिहरू यहाँ देखा पर्नेछन्'}
            </Text>
        </View>
    );

    const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
        <TouchableOpacity
            style={styles.historyItem}
            onPress={() => {/* TODO: Implement history item details view */}}
        >
            <View style={styles.historyHeader}>
                <Text style={styles.medicineName}>{item.medicineName}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Ionicons
                    name={item.status === 'success' ? 'checkmark-circle' : 'alert-circle'}
                    size={16}
                    color={item.status === 'success' ? theme.colors.primary : theme.colors.notification}
                    style={styles.statusIcon}
                />
                <Text style={[
                    styles.statusText,
                    { color: item.status === 'success' ? theme.colors.primary : theme.colors.notification }
                ]}>
                    {item.status === 'success'
                        ? (language === 'en' ? 'Successfully scanned' : 'सफलतापूर्वक स्क्यान गरियो')
                        : (language === 'en' ? 'Scan failed' : 'स्क्यान असफल भयो')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {language === 'en' ? 'Scan History' : 'स्क्यान इतिहास'}
                </Text>
                {historyItems.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearHistory}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={theme.colors.primary} />
                        ) : (
                            <>
                                <Ionicons name="trash-outline" size={20} color={theme.colors.primary} />
                                <Text style={styles.clearButtonText}>
                                    {language === 'en' ? 'Clear' : 'खाली गर्नुहोस्'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={historyItems}
                renderItem={renderHistoryItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}