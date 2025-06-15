import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AUTH_CONFIG } from '../../config/constants';
import { Spacing, Typography } from '../../constants/Colors';
import { fetchWithAuth } from '../../utils/api';
import { BackButton } from '../components/database/BackButton';
import { MedicineList } from '../components/database/MedicineList';
import { SearchBar } from '../components/database/SearchBar';
import TopicList from '../components/database/TopicList';
import { Cache, Medicine, Topic } from '../components/database/types';

export default function DatabaseScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { language, setLanguage } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [cache, setCache] = useState<Cache>({ topics: [], medicines: {} });
    const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
    const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
    const [isDirectSearch, setIsDirectSearch] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        searchContainer: {
            padding: Spacing.lg,
            gap: Spacing.md,
        },
        searchModeToggle: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: Spacing.md,
            marginBottom: Spacing.sm,
        },
        searchModeButton: {
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
        },
        searchModeButtonActive: {
            backgroundColor: theme.colors.primary,
        },
        searchModeText: {
            color: theme.colors.text,
            ...Typography.button,
        },
        searchModeTextActive: {
            color: '#fff',
        },
    });

    const fetchTopics = async () => {
        if (cache.topics.length > 0) {
            console.error('[Database] Using cached topics');
            setFilteredTopics(cache.topics);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchWithAuth(AUTH_CONFIG.AUTH_ENDPOINTS.FETCH_ALL_TOPICS);
            if (!response.ok) throw new Error('Failed to fetch topics');

            const json = await response.json();
            console.error('[Database] Topics:', json.data);

            setCache(prev => ({ ...prev, topics: json.data }));
            setFilteredTopics(json.data);
        } catch (error) {
            console.error('[Database] Error fetching topics:', error);
            Alert.alert(
                'Error',
                language === 'en' ? 'Failed to fetch topics' : 'विषय प्राप्त गर्न असफल भयो'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const searchMedicines = async (term: string) => {
        if (!term.trim()) {
            setFilteredMedicines([]);
            return;
        }

        setIsLoading(true);
        try {
            const url = `${AUTH_CONFIG.AUTH_ENDPOINTS.MEDICINE_SEARCH}/${encodeURIComponent(term)}`;
            const response = await fetchWithAuth(url);
            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new Error(`Failed to fetch medicines. Status: ${response.status}. Body: ${errorText}`);
            }
            const json = await response.json();
            setFilteredMedicines(json.data || []);
        } catch (error: any) {
            console.error('[Database] Error searching medicines:', error?.message || error, error);
            Alert.alert(
                'Error',
                language === 'en' ? 'Failed to search medicines' : 'औषधि खोज्न असफल भयो'
            );
            setFilteredMedicines([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMedicinesForTopic = async (topicId: string) => {
        if (cache.medicines[topicId]) {
            console.error('[Database] Using cached medicines for topic:', topicId);
            setFilteredMedicines(cache.medicines[topicId]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`${AUTH_CONFIG.AUTH_ENDPOINTS.FETCH_MEDICINES_BY_TOPIC}/${topicId}`);
            if (!response.ok) throw new Error('Failed to fetch medicines');

            const json = await response.json();
            console.error('[Database] Medicines for topic:', topicId, json.data);

            setCache(prev => ({
                ...prev,
                medicines: { ...prev.medicines, [topicId]: json.data }
            }));
            setFilteredMedicines(json.data);
        } catch (error) {
            console.error('[Database] Error fetching medicines for topic:', topicId, error);
            Alert.alert(
                'Error',
                language === 'en' ? 'Failed to fetch medicines' : 'औषधि प्राप्त गर्न असफल भयो'
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleTopicPress = (topic: Topic) => {
        setSelectedTopic(topic);
        setIsDirectSearch(false);
        fetchMedicinesForTopic(topic.id);
    };

    const handleBackPress = () => {
        setSelectedTopic(null);
        setFilteredMedicines([]);
        setIsDirectSearch(false);
    };

    const handleSearch = useCallback(() => {
        if (isDirectSearch) {
            searchMedicines(searchQuery);
        } else if (!searchQuery.trim()) {
            if (selectedTopic) {
                setFilteredMedicines(cache.medicines[selectedTopic.id] || []);
            } else {
                setFilteredTopics(cache.topics);
            }
        } else {
            const query = searchQuery.toLowerCase();
            if (selectedTopic) {
                const medicines = cache.medicines[selectedTopic.id] || [];
                const filtered = medicines.filter(medicine =>
                    (medicine.name && medicine.name.toLowerCase().includes(query)) ||
                    (medicine.atcCode && medicine.atcCode.toLowerCase().includes(query))
                );
                setFilteredMedicines(filtered);
            } else {
                const filtered = cache.topics.filter(topic =>
                    topic.name.toLowerCase().includes(query)
                );
                setFilteredTopics(filtered);
            }
        }
    }, [searchQuery, selectedTopic, cache, isDirectSearch]);

    const handleClearSearch = () => {
        setSearchQuery('');
        if (isDirectSearch) {
            setFilteredMedicines([]);
        } else {
            handleSearch();
        }
    };

    const handleLanguageChange = (newLanguage: 'en' | 'ne' | 'bh' | 'mai') => {
        setLanguage(newLanguage);
    };

    const toggleSearchMode = () => {
        setIsDirectSearch(!isDirectSearch);
        setSearchQuery('');
        setFilteredMedicines([]);
        setSelectedTopic(null);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.searchContainer}>
                {selectedTopic && (
                    <BackButton
                        title={selectedTopic.name}
                        onPress={handleBackPress}
                        theme={theme}
                    />
                )}
                <View style={styles.searchModeToggle}>
                    <TouchableOpacity
                        style={[
                            styles.searchModeButton,
                            !isDirectSearch && styles.searchModeButtonActive
                        ]}
                        onPress={() => !isDirectSearch || toggleSearchMode()}
                    >
                        <Text style={[
                            styles.searchModeText,
                            !isDirectSearch && styles.searchModeTextActive
                        ]}>
                            {language === 'en' ? 'By Topic' : 'विषय अनुसार'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.searchModeButton,
                            isDirectSearch && styles.searchModeButtonActive
                        ]}
                        onPress={() => isDirectSearch || toggleSearchMode()}
                    >
                        <Text style={[
                            styles.searchModeText,
                            isDirectSearch && styles.searchModeTextActive
                        ]}>
                            {language === 'en' ? 'Direct Search' : 'सिधा खोज'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmit={handleSearch}
                    placeholder={isDirectSearch
                        ? (language === 'en' ? 'Search medicines...' : 'औषधि खोज्नुहोस्...')
                        : selectedTopic
                            ? (language === 'en' ? 'Search medicines...' : 'औषधि खोज्नुहोस्...')
                            : (language === 'en' ? 'Search topics...' : 'विषय खोज्नुहोस्...')}
                    onClear={handleClearSearch}
                    theme={theme}
                    language={language}
                />
            </View>

            {isLoading ? (
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                    style={{ flex: 1 }}
                />
            ) : isDirectSearch || selectedTopic ? (
                <MedicineList
                    medicines={filteredMedicines}
                    theme={theme}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                />
            ) : (
                <TopicList
                    topics={filteredTopics}
                    onTopicPress={handleTopicPress}
                    theme={theme}
                    language={language}
                />
            )}
        </View>
    );
}