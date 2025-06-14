import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AUTH_CONFIG } from '@/config/constants';
import { Spacing } from '@/constants/Colors';
import { fetchWithAuth } from '@/utils/api';
import { BackButton } from '../components/database/BackButton';
import { MedicineList } from '../components/database/MedicineList';
import { SearchBar } from '../components/database/SearchBar';
import TopicList from '../components/database/TopicList';
import { Cache, Medicine, Topic } from '../components/database/types';
export default function DatabaseScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [cache, setCache] = useState<Cache>({ topics: [], medicines: {} });
    const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
    const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        searchContainer: {
            padding: Spacing.lg,
            gap: Spacing.md,
        },
    });

    const fetchTopics = async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth(AUTH_CONFIG.AUTH_ENDPOINTS.FETCH_ALL_TOPICS);
            if (!response.ok) throw new Error('Failed to fetch topics');

            const json = await response.json();
            console.error('[Database] Topics data:', json.data);
            setCache(prev => ({ ...prev, topics: json.data }));
            setFilteredTopics(json.data);
        } catch (error) {
            console.error('[Database] Error fetching topics:', error);
            Alert.alert(
                'Error',
                language === 'en' ? 'Failed to fetch topics' : 'विषयहरू प्राप्त गर्न असफल भयो'
            );
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
        fetchMedicinesForTopic(topic.id);
    };

    const handleBackPress = () => {
        setSelectedTopic(null);
        setFilteredMedicines([]);
    };

    const handleSearch = useCallback(() => {
        if (!searchQuery.trim()) {
            if (selectedTopic) {
                setFilteredMedicines(cache.medicines[selectedTopic.id] || []);
            } else {
                setFilteredTopics(cache.topics);
            }
            return;
        }

        const query = searchQuery.toLowerCase();
        if (selectedTopic) {
            const medicines = cache.medicines[selectedTopic.id] || [];
            const filtered = medicines.filter(medicine =>
                medicine.name.toLowerCase().includes(query) ||
                medicine.atcCode.toLowerCase().includes(query)
            );
            setFilteredMedicines(filtered);
        } else {
            const filtered = cache.topics.filter(topic =>
                topic.name.toLowerCase().includes(query)
            );
            setFilteredTopics(filtered);
        }
    }, [searchQuery, selectedTopic, cache]);

    const handleClearSearch = () => {
        setSearchQuery('');
        handleSearch();
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
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmit={handleSearch}
                    placeholder={selectedTopic
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
            ) : selectedTopic ? (
                <MedicineList
                    medicines={filteredMedicines}
                    theme={theme}
                    language={language}
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