import LoginScreen from '@/components/auth/LoginScreen';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert } from 'react-native';

const API_URL = 'https://care-net-api.vercel.app';

export default function AuthPage() {
    const colorScheme = 'light'; // Force light mode for login
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            
            // 1. Get Google OAuth URL from API
            const response = await fetch(`${API_URL}/auth/login/google`);
            const data = await response.json();
            
            if (!data.url) {
                throw new Error('Failed to get Google login URL');
            }
            
            // 2. Open Google login in browser
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                'carenet://' // Your app's deep link scheme
            );
            
            if (result.type === 'success' && result.url) {
                // 3. Extract the access token from the callback URL
                // The token will be in the URL fragment after Supabase redirects
                const url = new URL(result.url);
                const accessToken = url.searchParams.get('access_token') || 
                                   url.hash?.split('access_token=')[1]?.split('&')[0];
                
                if (accessToken) {
                    // 4. Verify token with our API
                    const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ access_token: accessToken })
                    });
                    
                    const userData = await verifyResponse.json();
                    
                    if (userData.needs_onboarding) {
                        // New user - go to role selection
                        // TODO: Navigate to onboarding with user data
                        router.replace('/(tabs)' as any);
                    } else {
                        // Existing user - go to home
                        router.replace('/(tabs)' as any);
                    }
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            Alert.alert('Errore', 'Impossibile effettuare il login con Google');
        } finally {
            setLoading(false);
        }
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
