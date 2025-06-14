import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '../../../constants/Colors';
import { EmptyState } from './EmptyState';
import { Topic, TopicListProps } from './types';

const TopicItem: React.FC<{
    topic: Topic;
    onPress: (topic: Topic) => void;
    theme: any;
}> = ({ topic, onPress, theme }) => (
    <Pressable
        style={({ pressed }) => [
            styles.topicItem,
            {
                backgroundColor: theme.colors.card,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.9 : 1,
            }
        ]}
        onPress={() => onPress(topic)}
    >
        <View style={styles.topicHeader}>
            <View style={styles.topicContent}>
                <Text style={[styles.topicName, { color: theme.colors.text }]}>
                    {topic.name}
                </Text>
            </View>
            <View style={styles.iconContainer}>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
            </View>
        </View>
    </Pressable>
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
        gap: Spacing.sm,
    },
    topicItem: {
        padding: Spacing.lg,
        borderRadius: 16,
        marginBottom: Spacing.sm,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    topicHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topicContent: {
        flex: 1,
        marginRight: Spacing.md,
    },
    topicName: {
        ...Typography.h3,
        fontSize: 18,
        letterSpacing: 0.2,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TopicList;