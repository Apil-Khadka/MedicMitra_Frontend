import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Typography } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

interface Medicine {
    id: string;
    name: string;
    genericName: string;
    manufacturer: string;
    category: string;
}

export default function DatabaseScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [medicines, setMedicines] = useState<Medicine[]>([]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        searchContainer: {
            padding: Spacing.lg,
            gap: Spacing.md,
        },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: 8,
            elevation: 2,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        searchInput: {
            flex: 1,
            marginLeft: Spacing.sm,
            fontSize: 16,
            padding: 0,
        },
        clearButton: {
            padding: Spacing.xs,
        },
        searchButton: {
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.lg,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        searchButtonText: {
            ...Typography.button,
            color: '#FFFFFF',
            fontSize: 16,
        },
        listContent: {
            padding: Spacing.lg,
            paddingTop: 0,
        },
        medicineItem: {
            padding: Spacing.lg,
            borderRadius: 12,
            marginBottom: Spacing.md,
            elevation: 2,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        medicineHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.xs,
        },
        medicineName: {
            ...Typography.h3,
            fontSize: 18,
            flex: 1,
        },
        medicineCategory: {
            ...Typography.caption,
            fontSize: 12,
            textTransform: 'uppercase',
        },
        medicineGeneric: {
            ...Typography.body2,
            fontSize: 14,
            opacity: 0.8,
            marginBottom: Spacing.xs,
        },
        medicineManufacturer: {
            ...Typography.caption,
            fontSize: 12,
            opacity: 0.6,
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

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            // TODO: Implement actual API call to fetch medicines
            // For now, we'll just show an empty state
            setMedicines([]);
        } catch (error) {
            console.error('Error searching medicines:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons
                name="search-outline"
                size={64}
                color={theme.colors.text}
                style={styles.emptyStateIcon}
            />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
                {language === 'en' ? 'No Medicines Found' : 'कुनै औषधि भेटिएन'}
            </Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
                {language === 'en'
                    ? 'Search for medicines by name, generic name, or manufacturer'
                    : 'नाम, जेनेरिक नाम, वा निर्माता द्वारा औषधि खोज्नुहोस्'}
            </Text>
        </View>
    );

    const renderMedicineItem = ({ item }: { item: Medicine }) => (
        <TouchableOpacity
            style={[styles.medicineItem, { backgroundColor: theme.colors.card }]}
            onPress={() => {/* TODO: Implement medicine details view */}}
        >
            <View style={styles.medicineHeader}>
                <Text style={[styles.medicineName, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <Text style={[styles.medicineCategory, { color: theme.colors.primary }]}>
                    {item.category}
                </Text>
            </View>
            <Text style={[styles.medicineGeneric, { color: theme.colors.text }]}>
                {item.genericName}
            </Text>
            <Text style={[styles.medicineManufacturer, { color: theme.colors.text }]}>
                {item.manufacturer}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="search" size={20} color={theme.colors.text} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.text }]}
                        placeholder={language === 'en' ? 'Search medicines...' : 'औषधि खोज्नुहोस्...'}
                        placeholderTextColor={theme.colors.text + '80'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}
                        >
                            <Ionicons name="close-circle" size={20} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.searchButtonText}>
                            {language === 'en' ? 'Search' : 'खोज्नुहोस्'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <FlatList
                data={medicines}
                renderItem={renderMedicineItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}