import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            // If user is already logged in, redirect to tabs
            router.replace('/(tabs)');
        }
    }, [user, isLoading]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}