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

            // 1. Get Google OAuth URL from API (uses frontend:// deep link as callback)
            const response = await fetch(`${API_URL}/auth/login/google`);
            const data = await response.json();

            if (!data.url) {
                throw new Error('Failed to get Google login URL');
            }

            // 2. Open Google login in browser with correct deep link scheme
            // This must match the "scheme" in app.json which is "frontend"
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                'frontend://auth/callback'
            );

            if (result.type === 'success' && result.url) {
                // 3. Extract the access token from the callback URL
                // Supabase returns tokens in the URL fragment (hash) like:
                // frontend://auth/callback#access_token=xxx&refresh_token=xxx&...
                let accessToken: string | null = null;

                // Try to get from hash fragment first (Supabase default)
                if (result.url.includes('#')) {
                    const hashParams = new URLSearchParams(result.url.split('#')[1]);
                    accessToken = hashParams.get('access_token');
                }

                // Fallback to query params
                if (!accessToken) {
                    const url = new URL(result.url);
                    accessToken = url.searchParams.get('access_token');
                }

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
                } else {
                    throw new Error('No access token received from authentication');
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
