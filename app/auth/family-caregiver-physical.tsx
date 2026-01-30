import FamilyCaregiverPhysicalData, { PhysicalData } from '@/components/auth/FamilyCaregiverPhysicalData';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function FamilyCaregiverPhysicalDataPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { data: registrationData, updatePhysicalData } = useRegistration();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleContinue = async (data: PhysicalData) => {
        setIsSubmitting(true);
        try {
            // Save physical data to context
            updatePhysicalData({
                heightCm: data.heightCm,
                weightKg: data.weightKg,
            });

            // Navigate to next step (home address)
            router.push('/auth/family-caregiver-address' as any);
        } catch (error) {
            console.error('Error saving physical data:', error);
            Alert.alert('Errore', 'Si è verificato un errore. Riprova.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <FamilyCaregiverPhysicalData
            colorScheme={colorScheme}
            onContinue={handleContinue}
            onBack={handleBack}
            currentStep={2}
            totalSteps={4}
            initialData={{
                heightCm: registrationData.heightCm,
                weightKg: registrationData.weightKg,
            }}
        />
    );
}
