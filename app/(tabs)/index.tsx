import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function DashboardScreen() {
    const { user } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getUserDisplayName = () => {
        if (!user) return 'User';

        if (user.firstName || user.lastName) {
            return `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }

        return user.email || 'User';
    };

    const quickActions = [
        { title: 'My Tours', icon: 'map', color: '#4CAF50' },
        { title: 'Favorites', icon: 'heart', color: '#F44336' },
        { title: 'Bookings', icon: 'calendar', color: '#2196F3' },
        { title: 'Messages', icon: 'envelope', color: '#9C27B0' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.welcomeText, { color: colors.text }]}>
                    Welcome back, {getUserDisplayName()}!
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                    What would you like to do today?
                </Text>
            </View>

            <View style={styles.quickActions}>
                {quickActions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.actionCard, { backgroundColor: colors.card }]}
                        onPress={() => {
                            // Handle action press
                            console.log(`Pressed ${action.title}`);
                        }}>
                        <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                            <FontAwesome name={action.icon as any} size={24} color="white" />
                        </View>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.recentSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
                <View style={[styles.recentCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.recentText, { color: colors.text }]}>
                        No recent activity to show
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 40,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    recentSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    recentCard: {
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    recentText: {
        fontSize: 16,
        opacity: 0.7,
    },
});
