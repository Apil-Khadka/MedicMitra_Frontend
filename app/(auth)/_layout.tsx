import { useAuth } from '@/contexts/AuthContext';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)' as any);
        }
    }, [user, router]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}