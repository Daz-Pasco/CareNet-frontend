import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
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

export default function OnboardingScreen4({ colorScheme }: Props) {
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Float animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Bounce animation for sparkle icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -5,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeIn }]}>
            {/* Decorative blurs */}
            <View
                style={[
                    styles.decorativeBlur,
                    styles.rightBlur,
                    { backgroundColor: Colors.primary + '0D' },
                ]}
            />
            <View
                style={[
                    styles.decorativeBlur,
                    styles.leftBlur,
                    { backgroundColor: '#3b82f60D' },
                ]}
            />

            {/* Main illustration container */}
            <Animated.View
                style={[
                    styles.illustrationContainer,
                    { transform: [{ translateY: floatAnim }] },
                ]}
            >
                {/* Outer pulse ring */}
                <Animated.View
                    style={[
                        styles.pulseRingOuter,
                        {
                            backgroundColor: Colors.primary + (colorScheme === 'dark' ? '1A' : '0D'),
                            transform: [{ scale: pulseAnim }],
                        },
                    ]}
                />

                {/* Inner ring */}
                <View
                    style={[
                        styles.pulseRingInner,
                        { backgroundColor: Colors.primary + (colorScheme === 'dark' ? '33' : '1A') },
                    ]}
                />

                {/* Main circle */}
                <View
                    style={[
                        styles.mainCircle,
                        {
                            backgroundColor: colorScheme === 'dark' ? colors.surface : '#FFFFFF',
                            borderColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6',
                        },
                    ]}
                >
                    {/* Background brain icon */}
                    <View style={styles.backgroundIconContainer}>
                        <MaterialIcons
                            name="psychology"
                            size={80}
                            color={Colors.primary}
                            style={styles.backgroundIcon}
                        />
                    </View>

                    {/* Main notification icon */}
                    <View style={styles.mainIconContainer}>
                        <MaterialIcons
                            name="notifications-active"
                            size={72}
                            color={Colors.primary}
                        />

                        {/* Sparkle icon */}
                        <Animated.View
                            style={[
                                styles.sparkleContainer,
                                { transform: [{ translateY: bounceAnim }] },
                            ]}
                        >
                            <MaterialIcons name="auto-awesome" size={28} color="#facc15" />
                        </Animated.View>
                    </View>

                    {/* Decorative dots */}
                    <View style={[styles.dot, styles.dotTopLeft, { backgroundColor: Colors.primary + '99' }]} />
                    <View style={[styles.dot, styles.dotBottomRight, { backgroundColor: Colors.primary + '66' }]} />
                    <View style={[styles.dot, styles.dotMiddleLeft, { backgroundColor: colorScheme === 'dark' ? '#6b7280' : '#9ca3af' }]} />
                </View>
            </Animated.View>

            {/* Text content */}
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colorScheme === 'dark' ? '#ffffff' : colors.text }]}>
                    Ricevi alert{'\n'}
                    <Text style={styles.titleHighlight}>intelligenti</Text>
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Il sistema impara le abitudini e ti avvisa solo quando qualcosa non va davvero.
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
    decorativeBlur: {
        position: 'absolute',
        width: 256,
        height: 256,
        borderRadius: 128,
        opacity: 0.5,
    },
    rightBlur: {
        top: '25%',
        right: -80,
    },
    leftBlur: {
        bottom: '25%',
        left: -80,
    },
    illustrationContainer: {
        width: 256,
        height: 256,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRingOuter: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
    },
    pulseRingInner: {
        position: 'absolute',
        width: 240,
        height: 240,
        borderRadius: 120,
    },
    mainCircle: {
        width: 192,
        height: 192,
        borderRadius: 96,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        zIndex: 10,
    },
    backgroundIconContainer: {
        position: 'absolute',
        opacity: 0.2,
        transform: [{ translateY: -32 }, { scale: 1.5 }],
    },
    backgroundIcon: {
        opacity: 0.5,
    },
    mainIconContainer: {
        position: 'relative',
        zIndex: 20,
    },
    sparkleContainer: {
        position: 'absolute',
        top: -4,
        right: -8,
    },
    dot: {
        position: 'absolute',
        borderRadius: 999,
    },
    dotTopLeft: {
        top: 32,
        left: 40,
        width: 8,
        height: 8,
    },
    dotBottomRight: {
        bottom: 40,
        right: 32,
        width: 12,
        height: 12,
    },
    dotMiddleLeft: {
        top: '50%',
        left: 16,
        width: 6,
        height: 6,
        marginTop: -3,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 320,
        gap: 16,
        zIndex: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    titleHighlight: {
        color: Colors.primary,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
    },
});
