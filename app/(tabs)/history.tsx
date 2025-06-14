import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HistoryItem {
    id: string;
    name: string;
    timestamp: string;
    manufacturer: string;
    dosage: string;
    type: string;
}

interface HistoryItemProps {
    item: HistoryItem;
    colors: typeof Colors.light | typeof Colors.dark;
    language: 'en' | 'ne';
    index: number;
}

// Mock data for history items - replace with actual data from your backend
const mockHistoryData: HistoryItem[] = [
    {
        id: '1',
        name: 'Paracetamol 500mg',
        timestamp: '2024-03-20T10:30:00',
        manufacturer: 'ABC Pharma',
        dosage: '500mg',
        type: 'Tablet',
    },
    {
        id: '2',
        name: 'Amoxicillin 250mg',
        timestamp: '2024-03-19T15:45:00',
        manufacturer: 'XYZ Pharma',
        dosage: '250mg',
        type: 'Capsule',
    },
    // Add more mock data as needed
];

const HistoryItem = ({ item, colors, language, index }: HistoryItemProps) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to medicine details
        console.log('Medicine details:', item);
    };

    return (
        <Animated.View
            entering={FadeInRight.delay(index * 100).springify()}
            style={[styles.historyItem, { backgroundColor: colors.card }]}
        >
            <TouchableOpacity
                style={styles.historyItemContent}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="medical" size={24} color={colors.primary} />
                </View>
                <View style={styles.medicineInfo}>
                    <Animated.Text
                        entering={FadeInDown.delay(index * 100 + 200).springify()}
                        style={[styles.medicineName, { color: colors.text }]}
                    >
                        {item.name}
                    </Animated.Text>
                    <Animated.Text
                        entering={FadeInDown.delay(index * 100 + 300).springify()}
                        style={[styles.medicineDetails, { color: colors.textSecondary }]}
                    >
                        {language === 'en'
                            ? `${item.type} • ${item.dosage} • ${item.manufacturer}`
                            : `${item.type} • ${item.dosage} • ${item.manufacturer}`
                        }
                    </Animated.Text>
                    <Animated.Text
                        entering={FadeInDown.delay(index * 100 + 400).springify()}
                        style={[styles.timestamp, { color: colors.textSecondary }]}
                    >
                        {new Date(item.timestamp).toLocaleString(language === 'en' ? 'en-US' : 'ne-NP')}
                    </Animated.Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function HistoryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { language } = useLanguage();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.background,
                paddingTop: Spacing.lg + insets.top,
            }
        ]}>
            <Animated.Text
                entering={FadeInDown.duration(500).springify()}
                style={[styles.title, { color: colors.text }]}
            >
                {language === 'en' ? 'Scan History' : 'स्क्यान इतिहास'}
            </Animated.Text>

            <FlatList
                data={mockHistoryData}
                renderItem={({ item, index }) => (
                    <HistoryItem
                        item={item}
                        colors={colors}
                        language={language}
                        index={index}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                    <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
                ListEmptyComponent={() => (
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={styles.emptyContainer}
                    >
                        <Ionicons
                            name="scan-outline"
                            size={64}
                            color={colors.textSecondary}
                            style={styles.emptyIcon}
                        />
                        <Animated.Text
                            entering={FadeInDown.delay(300).springify()}
                            style={[styles.emptyText, { color: colors.textSecondary }]}
                        >
                            {language === 'en'
                                ? 'No scan history yet'
                                : 'अहिलेसम्म कुनै स्क्यान इतिहास छैन'
                            }
                        </Animated.Text>
                    </Animated.View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    title: {
        ...Typography.h1,
        marginBottom: Spacing.xl,
    },
    listContainer: {
        paddingBottom: Spacing.xl,
    },
    historyItem: {
        borderRadius: 12,
        marginBottom: Spacing.sm,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    historyItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    medicineInfo: {
        flex: 1,
    },
    medicineName: {
        ...Typography.h3,
        marginBottom: 4,
    },
    medicineDetails: {
        ...Typography.body2,
        marginBottom: 4,
    },
    timestamp: {
        ...Typography.caption,
    },
    separator: {
        height: 1,
        marginVertical: Spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.xl * 2,
    },
    emptyIcon: {
        marginBottom: Spacing.lg,
    },
    emptyText: {
        ...Typography.body1,
        textAlign: 'center',
    },
});