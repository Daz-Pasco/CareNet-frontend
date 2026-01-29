import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Props {
    colorScheme: 'light' | 'dark';
}

export default function OnboardingScreen2({ colorScheme }: Props) {
    const colors = Colors[colorScheme];
    const fadeIn = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0.8)).current;
    const pulseOpacity = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Pulse ring animation
        Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.8,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1.4,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(pulseOpacity, {
                        toValue: 0.5,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseOpacity, {
                        toValue: 0.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseOpacity, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeIn }]}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Main illustration */}
            <View style={styles.illustrationContainer}>
                {/* Pulse ring - outer */}
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            backgroundColor: colors.redLight,
                            transform: [{ scale: pulseAnim }],
                            opacity: pulseOpacity,
                        },
                    ]}
                />

                {/* Inner static circle */}
                <View style={[styles.innerCircle, { backgroundColor: colors.redLighter }]} />

                {/* Falling person icon */}
                <View style={styles.mainIconContainer}>
                    <MaterialIcons
                        name="personal-injury"
                        size={72}
                        color={Colors.primary}
                    />
                </View>

                {/* SOS Badge - right side */}
                <View
                    style={[
                        styles.floatingBadge,
                        styles.sosBadge,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <MaterialIcons
                        name="emergency"
                        size={28}
                        color={Colors.primary}
                    />
                    <Text style={styles.sosText}>SOS</Text>
                </View>

                {/* Notification badge - left side */}
                <View
                    style={[
                        styles.floatingBadge,
                        styles.notificationBadge,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <MaterialIcons
                        name="notifications-active"
                        size={28}
                        color="#22C55E"
                    />
                </View>
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Rileva cadute e emergenze
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Se viene rilevata una caduta, notifichiamo immediatamente te e i servizi di emergenza.
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        width: 64,
        height: 64,
        marginBottom: 48,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    illustrationContainer: {
        width: 256,
        height: 256,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48,
    },
    pulseRing: {
        position: 'absolute',
        width: 192,
        height: 192,
        borderRadius: 96,
    },
    innerCircle: {
        position: 'absolute',
        width: 128,
        height: 128,
        borderRadius: 64,
    },
    mainIconContainer: {
        zIndex: 10,
        alignItems: 'center',
        marginBottom: 8,
    },
    floatingBadge: {
        position: 'absolute',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
    },
    sosBadge: {
        right: 16,
        top: '50%',
        transform: [{ translateY: -32 }],
    },
    sosText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.primary,
        marginTop: 2,
    },
    notificationBadge: {
        left: 16,
        bottom: 48,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 340,
        gap: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
    },
});
