import FamilyCaregiverMedicalInfo, { MedicalInfoData } from '@/components/auth/FamilyCaregiverMedicalInfo';
import { useRegistration } from '@/contexts/RegistrationContext';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function FamilyCaregiverMedicalInfoPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { data: registrationData, updateMedicalInfo } = useRegistration();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleContinue = async (data: MedicalInfoData) => {
        setIsSubmitting(true);
        try {
            // Save medical info to context
            updateMedicalInfo({
                allergies: data.allergies,
                conditions: data.conditions,
                medications: data.medications,
            });

            // Navigate to summary screen
            router.push('/auth/family-caregiver-summary' as Href);
        } catch (error) {
            console.error('Error saving medical info:', error);
            Alert.alert('Errore', 'Si è verificato un errore. Riprova.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <FamilyCaregiverMedicalInfo
            colorScheme={colorScheme}
            onContinue={handleContinue}
            onBack={handleBack}
            currentStep={4}
            totalSteps={4}
            initialData={{
                allergies: registrationData.allergies,
                conditions: registrationData.conditions,
                medications: registrationData.medications,
            }}
        />
    );
}
