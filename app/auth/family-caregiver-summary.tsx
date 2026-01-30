import FamilyCaregiverSummary from '@/components/auth/FamilyCaregiverSummary';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useAuth } from '@/providers/AuthProvider';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
        if (!session) return;

        setIsSubmitting(true);
        try {
            // Create user + elderly profile + medical info via API
            const response = await fetch(`${API_URL}/auth/complete-caregiver`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    full_name: summaryData.fullName,
                    patient_phone: summaryData.patientPhone,
                    caregiver_phone: summaryData.caregiverPhone,
                    date_of_birth: summaryData.dateOfBirth,
                    gender: summaryData.gender,
                    height_cm: summaryData.heightCm,
                    weight_kg: summaryData.weightKg,
                    address: summaryData.address,
                    allergies: summaryData.allergies,
                    conditions: summaryData.conditions,
                    medications: summaryData.medications,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.detail !== 'Profile already exists') {
                    throw new Error(error.detail || 'Failed to create profile');
                }
            }

            // Reset registration data
            resetData();

            // Navigate to home
            router.replace('/(tabs)' as Href);
        } catch (error: unknown) {
            console.error('Error completing registration:', error);
            const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore. Riprova.';
            Alert.alert('Errore', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleEditProfile = () => {
        router.push('/auth/family-caregiver-info' as Href);
    };

    const handleEditPhysical = () => {
        router.push('/auth/family-caregiver-physical' as Href);
    };

    const handleEditAddress = () => {
        router.push('/auth/family-caregiver-address' as Href);
    };

    const handleEditMedical = () => {
        router.push('/auth/family-caregiver-medical' as Href);
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
