import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthSuccess() {
    const { uuid } = useLocalSearchParams();
    const { handleAuthRedirect } = useAuth();

    useEffect(() => {
        if (uuid) {
            const url = `toura://auth/success?uuid=${uuid}`;
            handleAuthRedirect(url);
        }
    }, [uuid]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}