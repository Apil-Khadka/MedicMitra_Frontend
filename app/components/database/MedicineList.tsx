import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '../../../constants/Colors';
import { EmptyState } from './EmptyState';
import { Medicine, MedicineListProps } from './types';

const MedicineItem: React.FC<{
    medicine: Medicine;
    theme: any;
}> = ({ medicine, theme }) => (
    <View style={[styles.medicineItem, { backgroundColor: theme.colors.card }]}>
        <View style={styles.medicineHeader}>
            <Text style={[styles.medicineName, { color: theme.colors.text }]}>
                {medicine.name}
            </Text>
            {medicine.isVerified && (
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                    <Text style={[styles.verifiedText, { color: theme.colors.primary }]}>
                        Verified
                    </Text>
                </View>
            )}
        </View>
        <Text style={[styles.medicineAtcCode, { color: theme.colors.text }]}>
            ATC Code: {medicine.atcCode}
        </Text>
        <Text style={[styles.medicineDescription, { color: theme.colors.text }]}>
            {medicine.description}
        </Text>
    </View>
);

export const MedicineList: React.FC<MedicineListProps> = ({
                                                              medicines,
                                                              theme,
                                                              language,
                                                          }) => {
    return (
        <FlatList
            data={medicines}
            renderItem={({ item }) => (
                <MedicineItem
                    medicine={item}
                    theme={theme}
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
    listContent: {
        padding: Spacing.lg,
    },
    medicineItem: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.md,
        elevation: 2,
        shadowColor: '#000',
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
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 12,
        gap: Spacing.xs,
    },
    verifiedText: {
        ...Typography.caption,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    medicineAtcCode: {
        ...Typography.body2,
        fontSize: 14,
        opacity: 0.8,
        marginBottom: Spacing.xs,
    },
    medicineDescription: {
        ...Typography.body2,
        fontSize: 14,
        opacity: 0.7,
    },
});