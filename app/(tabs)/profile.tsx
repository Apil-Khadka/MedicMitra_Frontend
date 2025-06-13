import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const menuItems = [
        { title: 'Edit Profile', icon: 'user', action: () => console.log('Edit Profile') },
        { title: 'My Bookings', icon: 'calendar', action: () => console.log('My Bookings') },
        { title: 'Payment Methods', icon: 'credit-card', action: () => console.log('Payment Methods') },
        { title: 'Notifications', icon: 'bell', action: () => console.log('Notifications') },
        { title: 'Help & Support', icon: 'question-circle', action: () => console.log('Help & Support') },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={[styles.profileImageContainer, { backgroundColor: colors.card }]}>
                    {user?.photo ? (
                        <Image source={{ uri: user.photo }} style={styles.profileImage} />
                    ) : (
                        <FontAwesome name="user" size={50} color={colors.text} />
                    )}
                </View>
                <Text style={[styles.name, { color: colors.text }]}>{user?.firstName || 'User'}</Text>
                <Text style={[styles.email, { color: colors.text }]}>{user?.email}</Text>
            </View>

            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuItem, { backgroundColor: colors.card }]}
                        onPress={item.action}>
                        <View style={styles.menuItemLeft}>
                            <FontAwesome name={item.icon as any} size={20} color={colors.text} />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={16} color={colors.text} />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.signOutButton, { backgroundColor: '#FF3B30' }]}
                onPress={signOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        opacity: 0.7,
    },
    menuContainer: {
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 12,
    },
    signOutButton: {
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    signOutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});