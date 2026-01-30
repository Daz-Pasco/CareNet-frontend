import FamilyCaregiverSummary from '@/components/auth/FamilyCaregiverSummary';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function FamilyCaregiverSummaryPage() {
    const colorScheme = 'light';
    const router = useRouter();
    const { session } = useAuth();
    const { data: registrationData, resetData } = useRegistration();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Build summary data from registration context
    const summaryData = {
        fullName: session?.user?.user_metadata?.full_name || 'Utente',
        dateOfBirth: registrationData.dateOfBirth,
        patientPhone: registrationData.patientPhone,
        caregiverPhone: registrationData.caregiverPhone,
        gender: registrationData.gender,
        heightCm: registrationData.heightCm,
        weightKg: registrationData.weightKg,
        address: registrationData.address,
        allergies: registrationData.allergies,
        conditions: registrationData.conditions,
        medications: registrationData.medications,
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            // TODO: Call API to complete registration with all data
            console.log('Registration complete with data:', summaryData);

            // Reset registration data
            resetData();

            // Navigate to home
            router.replace('/(tabs)' as any);
        } catch (error) {
            console.error('Error completing registration:', error);
            Alert.alert('Errore', 'Si è verificato un errore. Riprova.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleEditProfile = () => {
        router.push('/auth/family-caregiver-info' as any);
    };

    const handleEditPhysical = () => {
        router.push('/auth/family-caregiver-physical' as any);
    };

    const handleEditAddress = () => {
        router.push('/auth/family-caregiver-address' as any);
    };

    const handleEditMedical = () => {
        router.push('/auth/family-caregiver-medical' as any);
    };

    return (
        <FamilyCaregiverSummary
            colorScheme={colorScheme}
            onConfirm={handleConfirm}
            onBack={handleBack}
            onEditProfile={handleEditProfile}
            onEditPhysical={handleEditPhysical}
            onEditAddress={handleEditAddress}
            onEditMedical={handleEditMedical}
            data={summaryData}
        />
    );
}
