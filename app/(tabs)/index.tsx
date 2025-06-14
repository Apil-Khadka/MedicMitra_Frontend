import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Typography } from '../../constants/Colors';
import { translations, useLanguage } from '../../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { language } = useLanguage();
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [showFeatureCard, setShowFeatureCard] = React.useState(false);

    useEffect(() => {
        // Start animations when component mounts
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ),
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 20000,
                    useNativeDriver: true,
                })
            ),
        ]).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleCameraPress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // TODO: Implement camera screen
        console.log('Camera pressed');
    };

    const handleHelpPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowFeatureCard(true);
    };

    const handleCloseFeatureCard = () => {
        setShowFeatureCard(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        background: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        content: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        },
        header: {
            position: 'absolute',
            top: insets.top + Spacing.xl,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 1,
        },
        subtitle: {
            ...Typography.body1,
            fontSize: 20,
            color: theme.colors.text,
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: Spacing.xl,
            fontWeight: '500',
        },
        cameraContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: height * 0.1,
        },
        cameraButton: {
            width: width * 0.4,
            height: width * 0.4,
            borderRadius: width * 0.2,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 8,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
        },
        cameraIcon: {
            color: '#FFFFFF',
            fontSize: width * 0.15,
        },
        cameraText: {
            ...Typography.button,
            color: theme.colors.text,
            marginTop: Spacing.md,
            fontSize: 18,
            fontWeight: '600',
        },
        helpButton: {
            position: 'absolute',
            bottom: insets.bottom + Spacing.xl,
            right: Spacing.xl,
            borderRadius: 30,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.lg,
            elevation: 4,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        helpButtonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
        },
        helpText: {
            ...Typography.button,
            fontSize: 16,
            fontWeight: '600',
        },
        floatingOrb: {
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            opacity: 0.1,
        },
        featureCard: {
            position: 'absolute',
            width: width * 0.8,
            padding: Spacing.lg,
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            elevation: 4,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        featureTitle: {
            ...Typography.h2,
            color: theme.colors.text,
            marginBottom: Spacing.sm,
        },
        featureText: {
            ...Typography.body1,
            color: theme.colors.text,
            opacity: 0.8,
        },
        patternDot: {
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        closeButton: {
            position: 'absolute',
            top: Spacing.sm,
            right: Spacing.sm,
            padding: Spacing.xs,
            zIndex: 1,
        },
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={[
                    theme.colors.background,
                    `${theme.colors.primary}10`,
                    theme.colors.background,
                ]}
                style={StyleSheet.absoluteFill}
            />

            {/* Animated background pattern */}
            <View style={StyleSheet.absoluteFill}>
                {[...Array(20)].map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.patternDot,
                            {
                                backgroundColor: theme.colors.primary,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                transform: [
                                    { rotate: spin },
                                    { scale: Math.random() * 0.5 + 0.5 },
                                ],
                                opacity: 0.1,
                            },
                        ]}
                    />
                ))}
            </View>

            <View style={styles.content}>
                <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                    <Text style={styles.subtitle}>
                        {translations[language].subtitle}
                    </Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.cameraContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={handleCameraPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="camera" style={styles.cameraIcon} />
                    </TouchableOpacity>
                    <Text style={styles.cameraText}>
                        {language === 'en' ? 'Scan Medicine' :
                            language === 'ne' ? 'औषधि स्क्यान गर्नुहोस्' :
                                language === 'bh' ? 'औषधि स्क्यान करीं' :
                                    'औषधि स्क्यान करू'}
                    </Text>
                </Animated.View>

                {showFeatureCard && (
                    <Animated.View
                        style={[
                            styles.featureCard,
                            {
                                bottom: height * 0.25,
                                opacity: fadeAnim,
                                transform: [{ translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0],
                                    })}],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCloseFeatureCard}
                        >
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.featureTitle}>
                            {language === 'en' ? 'How it works' : 'यो कसरी काम गर्छ'}
                        </Text>
                        <Text style={styles.featureText}>
                            {language === 'en'
                                ? 'Simply scan any medicine package or label to get instant information about the medicine, its uses, and precautions.'
                                : 'कुनै पनि औषधि प्याकेज वा लेबल स्क्यान गरेर औषधिको बारेमा तुरुन्तै जानकारी, यसको प्रयोग र सावधानीहरू प्राप्त गर्नुहोस्।'}
                        </Text>
                    </Animated.View>
                )}

                <TouchableOpacity
                    style={[
                        styles.helpButton,
                        {
                            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderWidth: 1,
                            borderColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        }
                    ]}
                    onPress={handleHelpPress}
                >
                    <View style={styles.helpButtonContent}>
                        <Ionicons
                            name="help-circle-outline"
                            size={24}
                            color={theme.colors.primary}
                        />
                        <Text style={[styles.helpText, { color: theme.colors.primary }]}>
                            {language === 'en' ? 'How it works' :
                                language === 'ne' ? 'कसरी काम गर्छ' :
                                    language === 'bh' ? 'कइसे काम करेला' :
                                        'कहिया काम करैत अछि'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
