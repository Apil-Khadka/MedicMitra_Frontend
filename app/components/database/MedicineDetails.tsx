import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AUTH_CONFIG } from '@/config/constants';
import { Spacing, Typography } from '@/constants/Colors';
import { fetchWithAuth } from '@/utils/api';
import { Medicine, MedicineDetailsProps } from './types';

const LanguageSelector: React.FC<{
    currentLanguage: string;
    onLanguageChange: (lang: 'en' | 'ne' | 'bh' | 'mai') => void;
    theme: any;
}> = ({ currentLanguage, onLanguageChange, theme }) => (
    <View style={styles.languageSelector}>
        {(['en', 'ne', 'bh', 'mai'] as const).map((lang) => (
            <TouchableOpacity
                key={lang}
                style={[
                    styles.languageButton,
                    {
                        backgroundColor: currentLanguage === lang ? theme.colors.primary : theme.colors.card,
                    },
                ]}
                onPress={() => onLanguageChange(lang)}
            >
                <Text
                    style={[
                        styles.languageText,
                        { color: currentLanguage === lang ? '#fff' : theme.colors.text },
                    ]}
                >
                    {lang.toUpperCase()}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

const DetailSection: React.FC<{
    title: string;
    content: string | string[] | null;
    theme: any;
}> = ({ title, content, theme }) => {
    if (!content) return null;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {title}
            </Text>
            {Array.isArray(content) ? (
                <View style={styles.listContainer}>
                    {content.map((item, index) => (
                        <View key={index} style={styles.listItem}>
                            <Ionicons name="ellipse" size={8} color={theme.colors.primary} />
                            <Text style={[styles.listItemText, { color: theme.colors.text }]}>
                                {item}
                            </Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
                    {content}
                </Text>
            )}
        </View>
    );
};

export const MedicineDetails: React.FC<MedicineDetailsProps> = ({
                                                                    medicine,
                                                                    theme,
                                                                    language,
                                                                    onLanguageChange,
                                                                }) => {
    const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
    const [details, setDetails] = useState<Medicine['details']>({});
    const [sideEffects, setSideEffects] = useState<Medicine['sideEffects']>({});
    const [brandNames, setBrandNames] = useState<Medicine['brandNames']>({});
    const [genericNames, setGenericNames] = useState<Medicine['genericNames']>({});
    const [dosageForms, setDosageForms] = useState<Medicine['dosageForms']>({});
    const [diseases, setDiseases] = useState<Medicine['diseases']>({});

    const fetchEndpoint = async (endpoint: string, setter: (data: any) => void, key: string) => {
        setIsLoading(prev => ({ ...prev, [key]: true }));
        try {
            const response = await fetchWithAuth(`${endpoint}/${medicine.id}`, {
                headers: { 'Accept-Language': language }
            });
            if (!response.ok) throw new Error(`Failed to fetch ${key}`);
            const data = await response.json();
            setter(data.data);
        } catch (error) {
            console.error(`Error fetching ${key}:`, error);
            setter({});
        } finally {
            setIsLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    useEffect(() => {
        // Fetch each endpoint independently
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_DETAILS, setDetails, 'details');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_SIDE_EFFECTS, setSideEffects, 'sideEffects');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_BRAND_NAMES, setBrandNames, 'brandNames');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_GENERIC_NAMES, setGenericNames, 'genericNames');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_DOSAGE_FORMS, setDosageForms, 'dosageForms');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_DISEASES, setDiseases, 'diseases');
    }, [medicine.id, language]);

    const renderSection = (title: string, key: string, content: any) => {
        if (isLoading[key]) {
            return (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        {title}
                    </Text>
                    <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loadingIndicator} />
                </View>
            );
        }

        return (
            <DetailSection
                title={title}
                content={content?.[language] || null}
                theme={theme}
            />
        );
    };

    return (
        <ScrollView style={styles.container}>
            <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
                theme={theme}
            />

            {renderSection('Details', 'details', details)}
            {renderSection('Side Effects', 'sideEffects', sideEffects)}
            {renderSection('Brand Names', 'brandNames', brandNames)}
            {renderSection('Generic Names', 'genericNames', genericNames)}
            {renderSection('Dosage Forms', 'dosageForms', dosageForms)}
            {renderSection('Diseases', 'diseases', diseases)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    languageSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    languageButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: 8,
        minWidth: 60,
        alignItems: 'center',
    },
    languageText: {
        ...Typography.button,
        fontSize: 14,
    },
    section: {
        marginBottom: Spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: Spacing.md,
        borderRadius: 12,
    },
    sectionTitle: {
        ...Typography.h3,
        fontSize: 16,
        marginBottom: Spacing.sm,
    },
    sectionContent: {
        ...Typography.body2,
        fontSize: 14,
        lineHeight: 20,
    },
    listContainer: {
        gap: Spacing.xs,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    listItemText: {
        ...Typography.body2,
        fontSize: 14,
        flex: 1,
    },
    loadingIndicator: {
        marginVertical: Spacing.md,
    },
});