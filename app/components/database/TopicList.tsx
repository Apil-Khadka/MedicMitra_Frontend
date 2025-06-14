import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Spacing, Typography } from '../../../constants/Colors';
import { EmptyState } from './EmptyState';
import { Topic, TopicListProps } from './types';

const TopicItem: React.FC<{
    topic: Topic;
    onPress: (topic: Topic) => void;
    theme: any;
}> = ({ topic, onPress, theme }) => (
    <TouchableOpacity
        style={[styles.topicItem, { backgroundColor: theme.colors.card }]}
        onPress={() => onPress(topic)}
    >
        <View style={styles.topicHeader}>
            <Text style={[styles.topicName, { color: theme.colors.text }]}>
                {topic.name}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
        </View>
    </TouchableOpacity>
);

const TopicList: React.FC<TopicListProps> = ({
                                                 topics,
                                                 onTopicPress,
                                                 theme,
                                                 language,
                                             }) => {
    return (
        <FlatList
            data={topics}
            renderItem={({ item }) => (
                <TopicItem
                    topic={item}
                    onPress={onTopicPress}
                    theme={theme}
                />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <EmptyState
                    type="topic"
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
    topicItem: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    topicHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topicName: {
        ...Typography.h3,
        fontSize: 18,
        flex: 1,
    },
});

export default TopicList;