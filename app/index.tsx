import { router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        } else {
            router.replace('/language' as any);
        }
    }, [user]);

    return null;
}