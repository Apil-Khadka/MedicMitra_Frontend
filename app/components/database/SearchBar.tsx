import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Spacing } from '../../../constants/Colors';
import { SearchBarProps } from './types';

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        value,
                                                        onChangeText,
                                                        onSubmit,
                                                        placeholder,
                                                        onClear,
                                                        theme,
                                                        language,
                                                    }) => {
    return (
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="search" size={20} color={theme.colors.text} />
            <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.text + '80'}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
            />
            {value.length > 0 && (
                <TouchableOpacity
                    onPress={onClear}
                    style={styles.clearButton}
                >
                    <Ionicons name="close-circle" size={20} color={theme.colors.text} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
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
});