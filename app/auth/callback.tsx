import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/**
 * OAuth Callback Handler
 * 
 * This is a fallback screen for when the OAuth callback is handled by the router.
 * Most of the heavy lifting is done by the AuthProvider which listens for deep links.
 * This screen just shows a loading state while the auth state settles.
 */
export default function AuthCallback() {
    const router = useRouter();
    const { session, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (session) {
                router.replace('/auth/role-selection' as any);
            } else {
                router.replace('/auth');
            }
        }
    }, [session, loading]);

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
