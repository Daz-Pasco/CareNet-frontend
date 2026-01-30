import LoginScreen from '@/components/auth/LoginScreen';
import { useAuth } from '@/providers/AuthProvider';
import { Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function AuthPage() {
    const colorScheme = 'light'; // Force light mode for login
    const router = useRouter();
    const { signInWithGoogle, session, loading } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    // Redirect to role selection if logged in (they'll choose their role there)
    useEffect(() => {
        if (!loading && session) {
            // After login, go to role selection
            router.replace('/auth/role-selection' as Href);
        }
    }, [session, loading]);

    const handleGoogleLogin = async () => {
        try {
            setIsSigningIn(true);
            await signInWithGoogle();
            // Navigation will happen automatically via the useEffect above
            // when session state changes
        } catch (error) {
            console.error('Google login error:', error);
            Alert.alert('Errore', 'Impossibile effettuare il login con Google');
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleBack = () => {
        router.replace('/onboarding' as Href);
    };

    return (
        <LoginScreen
            colorScheme={colorScheme}
            onGoogleLogin={handleGoogleLogin}
            onBack={handleBack}
        />
    );
}
