import { Colors } from '@/constants/theme';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const API_URL = 'https://care-net-api.vercel.app';

/**
 * OAuth Callback Handler
 * 
 * This screen handles the OAuth callback from Supabase.
 * When the user completes Google authentication, Supabase redirects to:
 * frontend://auth/callback#access_token=xxx&refresh_token=xxx&...
 * 
 * expo-router will navigate to this screen, where we extract and verify the token.
 */
export default function AuthCallback() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const globalParams = useGlobalSearchParams();

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            // Try to get access_token from params
            // expo-router may parse the hash fragment into params
            let accessToken = params.access_token as string || globalParams.access_token as string;

            if (!accessToken) {
                // If no token found, redirect back to login
                console.error('No access token found in callback');
                router.replace('/auth');
                return;
            }

            // Verify token with our API
            const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token: accessToken })
            });

            if (!verifyResponse.ok) {
                throw new Error('Token verification failed');
            }

            const userData = await verifyResponse.json();

            // TODO: Store the access token securely (e.g., SecureStore)
            // await SecureStore.setItemAsync('access_token', accessToken);

            if (userData.needs_onboarding) {
                // New user - go to role selection/onboarding
                router.replace('/(tabs)' as any);
            } else {
                // Existing user - go to home
                router.replace('/(tabs)' as any);
            }
        } catch (error) {
            console.error('Auth callback error:', error);
            router.replace('/auth');
        }
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.text}>Autenticazione in corso...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        gap: 16,
    },
    text: {
        fontSize: 16,
        color: '#6B7280',
    },
});
