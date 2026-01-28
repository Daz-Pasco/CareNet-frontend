import { Colors } from '@/constants/theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
    colorScheme: 'light' | 'dark';
}

export default function OnboardingScreen2({ colorScheme }: Props) {
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const pulseAnim = useRef(new Animated.Value(0.8)).current;
    const pulseOpacity = useRef(new Animated.Value(0.5)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        // Pulse ring animation
        Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.4,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0.8,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(pulseOpacity, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseOpacity, {
                        toValue: 0.5,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeIn }]}>
            {/* Main illustration */}
            <View style={styles.illustrationContainer}>
                {/* Pulse ring */}
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            backgroundColor: colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
                            transform: [{ scale: pulseAnim }],
                            opacity: pulseOpacity,
                        },
                    ]}
                />

                {/* Inner circle */}
                <View
                    style={[
                        styles.innerCircle,
                        { backgroundColor: colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2' },
                    ]}
                />

                {/* Main falling icon */}
                <View style={styles.mainIconContainer}>
                    <MaterialCommunityIcons
                        name="human-male"
                        size={80}
                        color={Colors.primary}
                        style={styles.fallingIcon}
                    />

                    {/* SOS Card - right side */}
                    <View
                        style={[
                            styles.floatingCard,
                            styles.sosCard,
                            {
                                backgroundColor: colorScheme === 'dark' ? colors.surface : '#FFFFFF',
                                borderColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6',
                            },
                        ]}
                    >
                        <MaterialIcons name="home" size={28} color={Colors.primary} />
                        <Text style={styles.sosText}>SOS</Text>
                    </View>

                    {/* Notification Card - left side */}
                    <View
                        style={[
                            styles.floatingCard,
                            styles.notificationCard,
                            {
                                backgroundColor: colorScheme === 'dark' ? colors.surface : '#FFFFFF',
                                borderColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6',
                            },
                        ]}
                    >
                        <MaterialIcons name="notifications-active" size={28} color="#22c55e" />
                    </View>
                </View>
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colorScheme === 'dark' ? '#ffffff' : colors.text }]}>
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
    illustrationContainer: {
        width: 256,
        height: 256,
        marginBottom: 48,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
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
        position: 'relative',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fallingIcon: {
        transform: [{ rotate: '30deg' }],
    },
    floatingCard: {
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
    sosCard: {
        right: -48,
        top: '50%',
        marginTop: -32,
    },
    notificationCard: {
        left: -48,
        bottom: 16,
    },
    sosText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.primary,
        marginTop: 4,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 320,
        gap: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
    },
});
