import ProfessionalProfileScreen from '@/components/auth/ProfessionalProfileScreen';
import { useAuth } from '@/providers/AuthProvider';
import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ProfessionalProfilePage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { session } = useAuth();

    useEffect(() => {
        if (!session) {
            router.replace('/auth' as Href);
        }
    }, [session]);

    const handleComplete = (data: { phone: string; professionalEmail: string; specialization: string; workplace: string }) => {
        // Navigate to summary screen with data
        router.push({
            pathname: '/auth/profile-summary',
            params: {
                phone: data.phone,
                professionalEmail: data.professionalEmail,
                specialization: data.specialization,
                workplace: data.workplace || '',
            },
        } as Href);
    };

    return (
        <ProfessionalProfileScreen
            colorScheme={colorScheme}
            onComplete={handleComplete}
        />
    );
}
