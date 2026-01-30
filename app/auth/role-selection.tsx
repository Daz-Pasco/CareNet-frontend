import RoleSelectionScreen from '@/components/auth/RoleSelectionScreen';
import { useAuth } from '@/providers/AuthProvider';
import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function RoleSelectionPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { session } = useAuth();

    useEffect(() => {
        if (!session) {
            router.replace('/auth' as Href);
        }
    }, [session]);

    const handleRoleSelected = (role: 'professional' | 'caregiver' | null) => {
        if (!role) return;

        if (role === 'professional') {
            // Go to professional profile completion
            router.push('/auth/professional-profile' as Href);
        } else if (role === 'caregiver') {
            // Family caregiver goes to personal info form
            router.push('/auth/family-caregiver-info' as Href);
        }
    };

    return (
        <RoleSelectionScreen
            colorScheme={colorScheme}
            onRoleSelected={handleRoleSelected}
        />
    );
}
