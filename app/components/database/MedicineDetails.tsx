import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AUTH_CONFIG } from '../../../config/constants';
import { Spacing, Typography } from '../../../constants/Colors';
import { fetchWithAuth } from '../../../utils/api';
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

const parseJsonString = (str: string): string[] => {
    try {
        // Remove extra quotes and braces
        const cleaned = str.replace(/[{}"]/g, '');
        // Split by comma and trim each item
        return cleaned.split(',').map(item => item.trim());
    } catch (error) {
        console.error('Error parsing JSON string:', error);
        return [str];
    }
};

const transformApiData = (data: any, key: string) => {
    if (!data) return {};

    switch (key) {
        case 'details':
            return {
                commonUses: data.commonUses?.map((item: string) => parseJsonString(item)).flat() || [],
                contradictions: data.contradictions?.map((item: string) => parseJsonString(item)).flat() || [],
                drugInteractions: data.drugInteractions?.map((item: string) => parseJsonString(item)).flat() || [],
                indications: data.indications?.map((item: string) => parseJsonString(item)).flat() || [],
                precautions: data.precautions?.map((item: string) => parseJsonString(item)).flat() || [],
                prescriptionRequired: data.prescriptionRequired || false,
                isTranslated: data.isTranslated || false
            };
        case 'sideEffects':
            return data.map((item: any) => ({
                ...item,
                details: parseJsonString(item.details).join(', ')
            }));
        case 'brandNames':
        case 'genericNames':
        case 'dosageForms':
            return data.map((item: any) => ({
                ...item,
                name: item.name || ''
            }));
        case 'diseases':
            return data.map((item: any) => ({
                ...item,
                name: item.name || '',
                isVerified: item.isVerified || false
            }));
        default:
            return data;
    }
};

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
            const transformedData = transformApiData(data.data, key);
            setter(transformedData);
        } catch (error) {
            console.error(`Error fetching ${key}:`, error);
            setter({});
        } finally {
            setIsLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    useEffect(() => {
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_DETAILS, setDetails, 'details');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_SIDE_EFFECTS, setSideEffects, 'sideEffects');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_BRAND_NAMES, setBrandNames, 'brandNames');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_GENERIC_NAMES, setGenericNames, 'genericNames');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_DOSAGE_FORMS, setDosageForms, 'dosageForms');
        fetchEndpoint(AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_DISEASES, setDiseases, 'diseases');
    }, [medicine.id, language]);

    useEffect(() => {
        console.error('Fetched medicine details:', details);
        console.error('Fetched medicine side effects:', sideEffects);
        console.error('Fetched medicine brand names:', brandNames);
        console.error('Fetched medicine generic names:', genericNames);
    }, [details, sideEffects, brandNames, genericNames]);

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
                content={content}
                theme={theme}
            />
        );
    };
// Helper to render details section fields
    const renderDetailsSection = () => {
        if (isLoading['details']) {
            return (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>
                    <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loadingIndicator} />
                </View>
            );
        }
        if (!details) return null;
        return (
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>
                <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
                    Prescription Required: {details.prescriptionRequired ? 'Yes' : 'No'}
                </Text>
                {details.commonUses?.length > 0 && (
                    <DetailSection title="Common Uses" content={details.commonUses} theme={theme} />
                )}
                {details.contradictions?.length > 0 && (
                    <DetailSection title="Contradictions" content={details.contradictions} theme={theme} />
                )}
                {/* Add other fields as needed */}
            </View>
        );
    };

// For array sections (sideEffects, brandNames, etc.)
    const renderArraySection = (title: string, key: string, items: any[], field: string = 'name') => {
        if (isLoading[key]) {
            return (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
                    <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loadingIndicator} />
                </View>
            );
        }
        if (!Array.isArray(items) || items.length === 0) return null;
        return (
            <DetailSection
                title={title}
                content={items.map(item => item[field] || '')}
                theme={theme}
            />
        );
    };
// In your return:
    return (
        <ScrollView style={styles.container}>
            <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
                theme={theme}
            />
            {renderDetailsSection()}
            {renderArraySection('Side Effects', 'sideEffects', sideEffects, 'details')}
            {renderArraySection('Brand Names', 'brandNames', brandNames)}
            {renderArraySection('Generic Names', 'genericNames', genericNames)}
            {renderArraySection('Dosage Forms', 'dosageForms', dosageForms)}
            {renderArraySection('Diseases', 'diseases', diseases)}
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