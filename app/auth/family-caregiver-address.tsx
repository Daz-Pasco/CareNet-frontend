import FamilyCaregiverAddress, { AddressData } from '@/components/auth/FamilyCaregiverAddress';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function FamilyCaregiverAddressPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { data: registrationData, updateAddress } = useRegistration();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleContinue = async (data: AddressData) => {
        setIsSubmitting(true);
        try {
            // Save address to context
            updateAddress(data.address);

            // Navigate to next step (medical info)
            router.push('/auth/family-caregiver-medical' as any);
        } catch (error) {
            console.error('Error saving address:', error);
            Alert.alert('Errore', 'Si è verificato un errore. Riprova.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <FamilyCaregiverAddress
            colorScheme={colorScheme}
            onContinue={handleContinue}
            onBack={handleBack}
            currentStep={3}
            totalSteps={4}
            initialData={{
                address: registrationData.address,
            }}
        />
    );
}
