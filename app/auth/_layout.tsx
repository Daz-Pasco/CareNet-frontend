import { RegistrationProvider } from '@/contexts/RegistrationContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <RegistrationProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="callback" />
                <Stack.Screen name="role-selection" />
                <Stack.Screen name="family-caregiver-info" />
                <Stack.Screen name="family-caregiver-physical" />
                <Stack.Screen name="family-caregiver-address" />
                <Stack.Screen name="family-caregiver-medical" />
                <Stack.Screen name="family-caregiver-summary" />
            </Stack>
        </RegistrationProvider>
    );
}
