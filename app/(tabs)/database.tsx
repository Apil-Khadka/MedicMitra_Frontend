import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Medicine {
    id: string;
    name: string;
    genericName: string;
    manufacturer: string;
    dosage: string;
    type: string;
    category: string;
}

interface MedicineItemProps {
    item: Medicine;
    colors: typeof Colors.light | typeof Colors.dark;
    language: 'en' | 'ne';
    index: number;
}

// Mock data for medicines - replace with actual data from your backend
const mockMedicines: Medicine[] = [
    {
        id: '1',
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        manufacturer: 'ABC Pharma',
        dosage: '500mg',
        type: 'Tablet',
        category: 'Analgesic',
    },
    {
        id: '2',
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin Trihydrate',
        manufacturer: 'XYZ Pharma',
        dosage: '250mg',
        type: 'Capsule',
        category: 'Antibiotic',
    },
    // Add more mock data as needed
];

const MedicineItem = ({ item, colors, language, index }: MedicineItemProps) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to medicine details
        console.log('Medicine details:', item);
    };

    return (
        <Animated.View
            entering={FadeInRight.delay(index * 100).springify()}
            style={[styles.medicineItem, { backgroundColor: colors.card }]}
        >
            <TouchableOpacity
                style={styles.medicineItemContent}
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
                        style={[styles.genericName, { color: colors.textSecondary }]}
                    >
                        {item.genericName}
                    </Animated.Text>
                    <Animated.Text
                        entering={FadeInDown.delay(index * 100 + 400).springify()}
                        style={[styles.medicineDetails, { color: colors.textSecondary }]}
                    >
                        {language === 'en'
                            ? `${item.type} • ${item.dosage} • ${item.category}`
                            : `${item.type} • ${item.dosage} • ${item.category}`
                        }
                    </Animated.Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function DatabaseScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

    const filteredMedicines = mockMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderSearchBar = useCallback(() => (
        <Animated.View
            entering={FadeInDown.duration(500).springify()}
            style={[styles.searchContainer, { backgroundColor: colors.card }]}
        >
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={language === 'en' ? 'Search medicines...' : 'औषधि खोज्नुहोस्...'}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={styles.clearButton}
                >
                    <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            )}
        </Animated.View>
    ), [searchQuery, colors, language]);

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
                {language === 'en' ? 'Medicine Database' : 'औषधि डाटाबेस'}
            </Animated.Text>

            {renderSearchBar()}

            <FlatList
                data={filteredMedicines}
                renderItem={({ item, index }) => (
                    <MedicineItem
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
                            name="search-outline"
                            size={64}
                            color={colors.textSecondary}
                            style={styles.emptyIcon}
                        />
                        <Animated.Text
                            entering={FadeInDown.delay(300).springify()}
                            style={[styles.emptyText, { color: colors.textSecondary }]}
                        >
                            {searchQuery.length > 0
                                ? (language === 'en'
                                    ? 'No medicines found'
                                    : 'कुनै औषधि भेटिएन')
                                : (language === 'en'
                                    ? 'Search for medicines'
                                    : 'औषधि खोज्नुहोस्')
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: 12,
        marginBottom: Spacing.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...Typography.body1,
        paddingVertical: Spacing.sm,
    },
    clearButton: {
        padding: Spacing.xs,
    },
    listContainer: {
        paddingBottom: Spacing.xl,
    },
    medicineItem: {
        borderRadius: 12,
        marginBottom: Spacing.sm,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    medicineItemContent: {
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
    genericName: {
        ...Typography.body2,
        marginBottom: 4,
        fontStyle: 'italic',
    },
    medicineDetails: {
        ...Typography.body2,
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