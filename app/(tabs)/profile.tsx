import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { Language, useLanguage } from '../../contexts/LanguageContext';

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
    colors: typeof Colors.light | typeof Colors.dark;
    language: Language;
}

const ProfileSection = ({ title, children, colors, language }: ProfileSectionProps) => (
    <Animated.View
        entering={FadeInDown.duration(500).springify()}
        style={styles.section}
    >
        <Animated.Text
            entering={FadeInDown.delay(200).duration(500).springify()}
            style={[styles.sectionTitle, { color: colors.textSecondary }]}
        >
            {title}
        </Animated.Text>
        <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            {children}
        </View>
    </Animated.View>
);

interface ProfileItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value?: string;
    onPress?: () => void;
    colors: typeof Colors.light | typeof Colors.dark;
    isLast?: boolean;
}

const ProfileItem = ({ icon, title, value, onPress, colors, isLast }: ProfileItemProps) => (
    <TouchableOpacity
        style={[
            styles.profileItem,
            !isLast && [styles.profileItemBorder, { borderBottomColor: colors.border }],
        ]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.profileItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <Animated.Text
                entering={FadeInDown.delay(300).duration(500).springify()}
                style={[styles.profileItemTitle, { color: colors.text }]}
            >
                {title}
            </Animated.Text>
        </View>
        <View style={styles.profileItemRight}>
            {value && (
                <Animated.Text
                    entering={FadeInDown.delay(400).duration(500).springify()}
                    style={[styles.profileItemValue, { color: colors.textSecondary }]}
                >
                    {value}
                </Animated.Text>
            )}
            {onPress && (
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textSecondary}
                />
            )}
        </View>
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { language } = useLanguage();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const handleEditProfile = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to edit profile screen
        console.log('Edit profile');
    };

    const handleNotifications = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to notifications settings
        console.log('Notifications settings');
    };

    const handlePrivacy = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to privacy settings
        console.log('Privacy settings');
    };

    const handleHelp = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to help center
        console.log('Help center');
    };

    const getTranslatedText = (key: string) => {
        switch (language) {
            case 'en':
                return key === 'editProfile' ? 'Edit Profile' :
                    key === 'accountSettings' ? 'Account Settings' :
                        key === 'notifications' ? 'Notifications' :
                            key === 'privacy' ? 'Privacy & Security' :
                                key === 'support' ? 'Support' :
                                    key === 'helpCenter' ? 'Help Center' : '';
            case 'ne':
                return key === 'editProfile' ? 'प्रोफाइल सम्पादन गर्नुहोस्' :
                    key === 'accountSettings' ? 'खाता सेटिङहरू' :
                        key === 'notifications' ? 'सूचनाहरू' :
                            key === 'privacy' ? 'गोपनीयता र सुरक्षा' :
                                key === 'support' ? 'सहयोग' :
                                    key === 'helpCenter' ? 'सहयोग केन्द्र' : '';
            case 'bh':
                return key === 'editProfile' ? 'प्रोफाइल एडिट करीं' :
                    key === 'accountSettings' ? 'खाता सेटिंग' :
                        key === 'notifications' ? 'नोटिफिकेशन' :
                            key === 'privacy' ? 'प्राइवेसी आ सुरक्षा' :
                                key === 'support' ? 'सहयोग' :
                                    key === 'helpCenter' ? 'हेल्प सेंटर' : '';
            case 'mai':
                return key === 'editProfile' ? 'प्रोफाइल एडिट करू' :
                    key === 'accountSettings' ? 'खाता सेटिंग' :
                        key === 'notifications' ? 'नोटिफिकेशन' :
                            key === 'privacy' ? 'प्राइवेसी आ सुरक्षा' :
                                key === 'support' ? 'सहयोग' :
                                    key === 'helpCenter' ? 'हेल्प सेंटर' : '';
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{
                paddingTop: Spacing.lg + insets.top,
            }}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View
                entering={FadeInDown.duration(500).springify()}
                style={styles.header}
            >
                <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                    {user?.photo ? (
                        <Image
                            source={{ uri: user.photo }}
                            style={styles.avatar}
                        />
                    ) : (
                        <Ionicons
                            name="person"
                            size={48}
                            color={colors.primary}
                        />
                    )}
                </View>
                <Animated.Text
                    entering={FadeInDown.delay(200).duration(500).springify()}
                    style={[styles.name, { color: colors.text }]}
                >
                    {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : (language === 'en' ? 'User' : 'प्रयोगकर्ता')
                    }
                </Animated.Text>
                <Animated.Text
                    entering={FadeInDown.delay(300).duration(500).springify()}
                    style={[styles.email, { color: colors.textSecondary }]}
                >
                    {user?.email || (language === 'en' ? 'No email set' : 'इमेल सेट गरिएको छैन')}
                </Animated.Text>
                <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: colors.primary }]}
                    onPress={handleEditProfile}
                    activeOpacity={0.8}
                >
                    <Ionicons name="pencil" size={16} color={colors.buttonText} />
                    <Animated.Text
                        entering={FadeInDown.delay(400).duration(500).springify()}
                        style={[styles.editButtonText, { color: colors.buttonText }]}
                    >
                        {getTranslatedText('editProfile')}
                    </Animated.Text>
                </TouchableOpacity>
            </Animated.View>

            <ProfileSection
                title={getTranslatedText('accountSettings')}
                colors={colors}
                language={language}
            >
                <ProfileItem
                    icon="notifications-outline"
                    title={getTranslatedText('notifications')}
                    onPress={handleNotifications}
                    colors={colors}
                />
                <ProfileItem
                    icon="shield-checkmark-outline"
                    title={getTranslatedText('privacy')}
                    onPress={handlePrivacy}
                    colors={colors}
                    isLast
                />
            </ProfileSection>

            <ProfileSection
                title={getTranslatedText('support')}
                colors={colors}
                language={language}
            >
                <ProfileItem
                    icon="help-circle-outline"
                    title={getTranslatedText('helpCenter')}
                    onPress={handleHelp}
                    colors={colors}
                    isLast
                />
            </ProfileSection>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    name: {
        ...Typography.h2,
        marginBottom: Spacing.xs,
    },
    email: {
        ...Typography.body1,
        marginBottom: Spacing.lg,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: 20,
        gap: Spacing.xs,
    },
    editButtonText: {
        ...Typography.button,
        fontSize: 14,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    sectionContent: {
        borderRadius: 12,
        marginHorizontal: Spacing.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    profileItemBorder: {
        borderBottomWidth: 1,
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    profileItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileItemTitle: {
        ...Typography.body1,
    },
    profileItemValue: {
        ...Typography.body2,
    },
});

