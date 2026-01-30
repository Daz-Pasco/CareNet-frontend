import ProfileSummaryScreen from '@/components/auth/ProfileSummaryScreen';
import { useAuth } from '@/providers/AuthProvider';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileSummaryPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { session, user } = useAuth();
    const params = useLocalSearchParams<{
        phone: string;
        professionalEmail: string;
        specialization: string;
        workplace: string;
    }>();

    useEffect(() => {
        if (!session) {
            router.replace('/auth');
        }
    }, [session]);

    const profileData = {
        fullName: user?.user_metadata?.full_name || user?.email || 'Utente',
        personalEmail: user?.email || '',
        professionalEmail: params.professionalEmail || '',
        phone: params.phone || null,
        specialization: params.specialization || '',
        workplace: params.workplace || null,
        avatarUrl: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null,
    };

    const handleConfirm = async () => {
        if (!session) return;

        try {
            // Create user + professional profile via API
            const response = await fetch(`${API_URL}/auth/complete-professional`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    full_name: profileData.fullName,
                    phone: profileData.phone,
                    professional_email: profileData.professionalEmail,
                    specialization: profileData.specialization,
                    workplace: profileData.workplace || null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.detail !== 'Profile already exists') {
                    throw new Error(error.detail || 'Failed to create profile');
                }
            }

            router.replace('/(tabs)' as Href);
        } catch (error: unknown) {
            console.error('Error completing profile:', error);
            const errorMessage = error instanceof Error ? error.message : 'Impossibile completare il profilo. Riprova.';
            Alert.alert('Errore', errorMessage);
        }
    };

    const handleEdit = () => {
        router.back();
    };

    return (
        <ProfileSummaryScreen
            colorScheme={colorScheme}
            profileData={profileData}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
        />
    );
}
