import LoginScreen from '@/components/auth/LoginScreen';
import { useRouter } from 'expo-router';

export default function AuthPage() {
    const colorScheme = 'light'; // Force light mode for login
    const router = useRouter();

    const handleGoogleLogin = () => {
        // TODO: Implementare autenticazione Google
        console.log('Login con Google');
        // Dopo il login, naviga alla home dell'app
        // router.replace('/home');
    };

    const handleBack = () => {
        router.replace('/onboarding' as any);
    };

    return (
        <LoginScreen
            colorScheme={colorScheme}
            onGoogleLogin={handleGoogleLogin}
            onBack={handleBack}
        />
    );
}
