import FamilyCaregiverPersonalInfo, { PersonalInfoData } from '@/components/auth/FamilyCaregiverPersonalInfo';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function FamilyCaregiverPersonalInfoPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { session } = useAuth();
    const { data: registrationData, updatePersonalInfo } = useRegistration();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!session) {
            router.replace('/auth' as any);
        }
    }, [session]);

    const handleContinue = async (data: PersonalInfoData) => {
        if (!session || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Save personal info to context
            updatePersonalInfo({
                dateOfBirth: data.dateOfBirth,
                patientPhone: data.patientPhone,
                caregiverPhone: data.caregiverPhone,
                gender: data.gender,
            });

            // Navigate to physical data screen (step 2)
            router.push('/auth/family-caregiver-physical' as any);
        } catch (error) {
            console.error('Error saving personal info:', error);
            Alert.alert('Errore', 'Si è verificato un errore. Riprova.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <FamilyCaregiverPersonalInfo
            colorScheme={colorScheme}
            onContinue={handleContinue}
            onBack={handleBack}
            currentStep={1}
            totalSteps={4}
            initialData={{
                dateOfBirth: registrationData.dateOfBirth,
                patientPhone: registrationData.patientPhone,
                caregiverPhone: registrationData.caregiverPhone,
                gender: registrationData.gender,
            }}
        />
    );
}
