import RoleSelectionScreen from '@/components/auth/RoleSelectionScreen';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RoleSelectionPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { session } = useAuth();

    // Redirect if not logged in
    useEffect(() => {
        if (!session) {
            router.replace('/auth' as any);
        }
    }, [session]);

    const handleRoleSelected = async (role: 'professional' | 'caregiver' | null) => {
        if (!role || !session) return;

        // Navigate to the appropriate registration flow based on role
        if (role === 'caregiver') {
            // Family caregiver goes to personal info form
            router.push('/auth/family-caregiver-info' as any);
            return;
        }

        // Professional goes directly to complete profile (or their own flow later)
        try {
            const response = await fetch(`${API_URL}/auth/complete-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    full_name: session.user?.user_metadata?.full_name || session.user?.email || 'User',
                    role: 'professional',
                    phone: null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                // Profile might already exist
                if (error.detail === 'Profile already exists') {
                    router.replace('/(tabs)' as any);
                    return;
                }
                throw new Error(error.detail || 'Failed to complete profile');
            }

            // Navigate to home
            router.replace('/(tabs)' as any);
        } catch (error) {
            console.error('Error completing profile:', error);
            Alert.alert('Errore', 'Impossibile completare il profilo. Riprova.');
        }
    };

    return (
        <RoleSelectionScreen
            colorScheme={colorScheme}
            onRoleSelected={handleRoleSelected}
        />
    );
}
