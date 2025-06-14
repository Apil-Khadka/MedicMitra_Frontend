import { Colors, Spacing, Typography } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TabsIndexScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { language } = useLanguage();
    const [showHelp, setShowHelp] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(1));

    const handleCameraPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        // TODO: Implement camera functionality
        console.log('Camera pressed');
    };

    const handleHelpPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowHelp(true);
    };

    const helpText = language === 'en'
        ? "This is MedicMitra. You can scan a medicine and get the basic characteristics of the said medicine."
        : "यो MedicMitra हो। तपाईंले औषधि स्क्यान गरेर उक्त औषधिको आधारभूत विशेषताहरू प्राप्त गर्न सक्नुहुन्छ।";

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Camera Button */}
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCameraPress}
                activeOpacity={0.8}
            >
                <Animated.View
                    style={[
                        styles.cameraIconContainer,
                        {
                            backgroundColor: colors.primary,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Ionicons name="camera" size={80} color={colors.buttonText} />
                </Animated.View>
            </TouchableOpacity>

            {/* Help Button */}
            <TouchableOpacity
                style={[styles.helpButton, { backgroundColor: colors.card }]}
                onPress={handleHelpPress}
                activeOpacity={0.7}
            >
                <Ionicons name="help-circle" size={32} color={colors.primary} />
            </TouchableOpacity>

            {/* Help Modal */}
            <Modal
                visible={showHelp}
                transparent
                animationType="fade"
                onRequestClose={() => setShowHelp(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowHelp(false)}
                >
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Ionicons
                            name="information-circle"
                            size={48}
                            color={colors.primary}
                            style={styles.modalIcon}
                        />
                        <Text style={[styles.modalText, { color: colors.text }]}>
                            {helpText}
                        </Text>
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: colors.primary }]}
                            onPress={() => setShowHelp(false)}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.buttonText }]}>
                                {language === 'en' ? 'Close' : 'बन्द गर्नुहोस्'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -60 }, { translateY: -60 }],
    },
    cameraIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    helpButton: {
        position: 'absolute',
        bottom: 40,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: SCREEN_WIDTH * 0.85,
        padding: Spacing.xl,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    modalIcon: {
        marginBottom: Spacing.lg,
    },
    modalText: {
        ...Typography.body1,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 24,
    },
    closeButton: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.xl,
        borderRadius: 8,
    },
    closeButtonText: {
        ...Typography.button,
        fontSize: 16,
    },
});
