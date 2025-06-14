import { Spacing, Typography } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

function RootLayoutContent() {
    const colorScheme = useColorScheme();
    const { isLoading: isAuthLoading } = useAuth();
    const { isLoading: isLanguageLoading, language, setLanguage } = useLanguage();
    const [loaded] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const insets = useSafeAreaInsets();
    const { signOut } = useAuth();
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    const colors = theme.colors;

    if (!loaded || isAuthLoading || isLanguageLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const handleLanguageSwitch = () => {
        setLanguage(language === 'en' ? 'ne' : 'en');
    };

    const handleProfilePress = () => {
        router.push('/profile' as any);
    };

    const handleDatabasePress = () => {
        router.push('/database' as any);
    };

    const handleHistoryPress = () => {
        router.push('/history' as any);
    };

    const handleHomePress = () => {
        router.push('/' as any);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleCameraPress = () => {
        // TODO: Implement camera functionality
        console.log('Camera pressed');
    };

    const styles = StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            height: 60,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
            elevation: 4,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        headerContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
        },
        menuButton: {
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        titleContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 0,
        },
        title: {
            ...Typography.h1,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        languageButton: {
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        languageText: {
            ...Typography.button,
            fontSize: 16,
            fontWeight: '600',
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: Spacing.sm,
            gap: Spacing.sm,
        },
        menuText: {
            ...Typography.body1,
            fontSize: 16,
        },
    });

    return (
        <ThemeProvider value={theme}>
            <Stack
                screenOptions={{
                    header: () => (
                        <View style={[styles.header, {
                            paddingTop: insets.top + Spacing.md,
                        }]}>
                            <View style={styles.headerContent}>
                                {/* Left: Menu Button */}
                                <TouchableOpacity
                                    style={styles.menuButton}
                                    onPress={() => {}}
                                >
                                    <Menu>
                                        <MenuTrigger>
                                            <Ionicons name="menu" size={28} color={colors.text} />
                                        </MenuTrigger>
                                        <MenuOptions customStyles={{
                                            optionsContainer: {
                                                backgroundColor: colors.card,
                                                borderRadius: 8,
                                                padding: 8,
                                                marginTop: 8,
                                                width: 200,
                                            }
                                        }}>
                                            <MenuOption onSelect={handleHomePress}>
                                                <View style={styles.menuItem}>
                                                    <Ionicons name="home-outline" size={24} color={colors.text} />
                                                    <Text style={[styles.menuText, { color: colors.text }]}>
                                                        {language === 'en' ? 'Home' : 'गृहपृष्ठ'}
                                                    </Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={handleProfilePress}>
                                                <View style={styles.menuItem}>
                                                    <Ionicons name="person-circle-outline" size={24} color={colors.text} />
                                                    <Text style={[styles.menuText, { color: colors.text }]}>
                                                        {language === 'en' ? 'User Profile' : 'प्रयोगकर्ता प्रोफाइल'}
                                                    </Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={handleDatabasePress}>
                                                <View style={styles.menuItem}>
                                                    <Ionicons name="server-outline" size={24} color={colors.text} />
                                                    <Text style={[styles.menuText, { color: colors.text }]}>
                                                        {language === 'en' ? 'Full Database' : 'पूर्ण डाटाबेस'}
                                                    </Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={handleHistoryPress}>
                                                <View style={styles.menuItem}>
                                                    <Ionicons name="time-outline" size={24} color={colors.text} />
                                                    <Text style={[styles.menuText, { color: colors.text }]}>
                                                        {language === 'en' ? 'History' : 'इतिहास'}
                                                    </Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={handleSignOut}>
                                                <View style={styles.menuItem}>
                                                    <Ionicons name="log-out-outline" size={24} color={colors.text} />
                                                    <Text style={[styles.menuText, { color: colors.text }]}>
                                                        {language === 'en' ? 'Sign Out' : 'साइन आउट'}
                                                    </Text>
                                                </View>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </TouchableOpacity>

                                {/* Center: Title */}
                                <View style={styles.titleContainer}>
                                    <Text style={[styles.title, { color: colors.text }]}>MedicMitra</Text>
                                </View>

                                {/* Right: Language Button */}
                                <TouchableOpacity
                                    style={styles.languageButton}
                                    onPress={handleLanguageSwitch}
                                >
                                    <Text style={[styles.languageText, { color: colors.primary }]}>
                                        {language === 'en' ? 'ने' : 'EN'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ),
                    headerShown: true,
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="database"
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="history"
                    options={{
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="profile"
                    options={{
                        headerShown: true,
                    }}
                />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <MenuProvider>
            <LanguageProvider>
                <AuthProvider>
                    <RootLayoutContent />
                </AuthProvider>
            </LanguageProvider>
        </MenuProvider>
    );
}
