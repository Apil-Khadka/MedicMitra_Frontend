import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '../../../constants/Colors';
import { EmptyState } from './EmptyState';
import { MedicineDetails } from './MedicineDetails';
import { Medicine, MedicineListProps } from './types';

const MedicineItem: React.FC<{
    medicine: Medicine;
    theme: any;
    onPress: (medicine: Medicine) => void;
}> = ({ medicine, theme, onPress }) => (
    <Pressable
        style={({ pressed }) => [
            styles.medicineItem,
            {
                backgroundColor: theme.colors.card,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.9 : 1,
            }
        ]}
        onPress={() => onPress(medicine)}
    >
        <View style={styles.medicineContent}>
            <View style={styles.medicineHeader}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.medicineName, { color: theme.colors.text }]}>
                        {medicine.name}
                    </Text>
                    {medicine.isVerified && (
                        <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                            <Text style={[styles.verifiedText, { color: theme.colors.primary }]}>
                                Verified
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={[styles.atcContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.medicineAtcCode, { color: theme.colors.text }]}>
                    ATC Code: {medicine.atcCode}
                </Text>
            </View>
            <View style={[styles.descriptionContainer, { backgroundColor: theme.colors.background + '50' }]}>
                <Text style={[styles.medicineDescription, { color: theme.colors.text }]}>
                    {medicine.description}
                </Text>
            </View>
        </View>
    </Pressable>
);

export const MedicineList: React.FC<MedicineListProps> = ({
                                                              medicines,
                                                              theme,
                                                              language,
                                                              onLanguageChange,
                                                          }) => {
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

    const handleMedicinePress = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
    };

    const handleBackPress = () => {
        setSelectedMedicine(null);
    };

    if (selectedMedicine) {
        return (
            <View style={styles.container}>
                <Pressable
                    style={[styles.backButton, { backgroundColor: theme.colors.card }]}
                    onPress={handleBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    <Text style={[styles.backButtonText, { color: theme.colors.text }]}>
                        {selectedMedicine.name}
                    </Text>
                </Pressable>
                <MedicineDetails
                    medicine={selectedMedicine}
                    theme={theme}
                    language={language}
                    onLanguageChange={onLanguageChange}
                />
            </View>
        );
    }

    return (
        <FlatList
            data={medicines}
            renderItem={({ item }) => (
                <MedicineItem
                    medicine={item}
                    theme={theme}
                    onPress={handleMedicinePress}
                />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <EmptyState
                    type="medicine"
                    theme={theme}
                    language={language}
                />
            }
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    medicineItem: {
        borderRadius: 16,
        marginBottom: Spacing.sm,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },
    medicineContent: {
        padding: Spacing.lg,
    },
    medicineHeader: {
        marginBottom: Spacing.md,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    medicineName: {
        ...Typography.h3,
        fontSize: 18,
        letterSpacing: 0.2,
        flex: 1,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 12,
        gap: Spacing.xs,
    },
    verifiedText: {
        ...Typography.caption,
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    atcContainer: {
        padding: Spacing.sm,
        borderRadius: 8,
        marginBottom: Spacing.sm,
    },
    medicineAtcCode: {
        ...Typography.body2,
        fontSize: 14,
        opacity: 0.8,
        fontFamily: 'monospace',
    },
    descriptionContainer: {
        padding: Spacing.md,
        borderRadius: 8,
    },
    medicineDescription: {
        ...Typography.body2,
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButtonText: {
        ...Typography.body1,
        marginLeft: Spacing.sm,
        fontSize: 16,
    },
}); 