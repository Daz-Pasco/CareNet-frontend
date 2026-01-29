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

export default function OnboardingScreen3({ colorScheme }: Props) {
    const colors = Colors[colorScheme];
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(20)).current;
    const slideUpOpacity = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const sparkPulse = useRef(new Animated.Value(0.8)).current;
    const bgPulse1 = useRef(new Animated.Value(0.4)).current;
    const bgPulse2 = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        // Fade in for logo
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Slide up animation
        Animated.parallel([
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideUpOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Bounce animation for shield badge
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -8,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Spark pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(sparkPulse, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(sparkPulse, {
                    toValue: 0.8,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Background pulse animations
        Animated.loop(
            Animated.sequence([
                Animated.timing(bgPulse1, {
                    toValue: 0.6,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(bgPulse1, {
                    toValue: 0.4,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.delay(1500),
                Animated.timing(bgPulse2, {
                    toValue: 0.6,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(bgPulse2, {
                    toValue: 0.4,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background decorative blurs */}
            <Animated.View
                style={[
                    styles.decorativeBlur,
                    styles.topBlur,
                    { backgroundColor: colors.redLight, opacity: bgPulse1 },
                ]}
            />
            <Animated.View
                style={[
                    styles.decorativeBlur,
                    styles.bottomBlur,
                    { backgroundColor: colors.redLighter, opacity: bgPulse2 },
                ]}
            />

            {/* Logo */}
            <Animated.View style={[styles.logoContainer, { opacity: fadeIn }]}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Main illustration */}
            <Animated.View
                style={[
                    styles.illustrationContainer,
                    {
                        transform: [{ translateY: slideUp }],
                        opacity: slideUpOpacity,
                    },
                ]}
            >
                {/* Main circle with lightbulb */}
                <View
                    style={[
                        styles.mainCircle,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.redLighter,
                        },
                    ]}
                >
                    {/* Gradient overlay */}
                    <View style={[styles.gradientOverlay, { backgroundColor: colors.redLighter }]} />

                    <MaterialIcons
                        name="lightbulb"
                        size={80}
                        color={Colors.primary}
                        style={styles.mainIcon}
                    />
                </View>

                {/* Shield badge - bottom right */}
                <Animated.View
                    style={[
                        styles.shieldBadge,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            transform: [{ translateY: bounceAnim }],
                        },
                    ]}
                >
                    <MaterialIcons
                        name="health-and-safety"
                        size={32}
                        color={Colors.primary}
                    />
                </Animated.View>

                {/* Spark - top left */}
                <Animated.View
                    style={[
                        styles.sparkContainer,
                        { opacity: sparkPulse },
                    ]}
                >
                    <MaterialIcons
                        name="auto-awesome"
                        size={24}
                        color={Colors.primary}
                    />
                </Animated.View>
            </Animated.View>

            {/* Text content */}
            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        transform: [{ translateY: slideUp }],
                        opacity: slideUpOpacity,
                    },
                ]}
            >
                <Text style={[styles.title, { color: colors.text }]}>
                    Ricevi <Text style={styles.titleHighlight}>alert</Text> intelligenti
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Il sistema impara le abitudini e ti avvisa solo quando <Text style={styles.descHighlight}>qualcosa non va</Text> davvero.
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    decorativeBlur: {
        position: 'absolute',
        borderRadius: 999,
    },
    topBlur: {
        top: '-15%',
        right: '-15%',
        width: 320,
        height: 320,
    },
    bottomBlur: {
        bottom: '10%',
        left: '-10%',
        width: 256,
        height: 256,
    },
    logoContainer: {
        width: 48,
        height: 48,
        marginBottom: 40,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    illustrationContainer: {
        position: 'relative',
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainCircle: {
        width: 192,
        height: 192,
        borderRadius: 96,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 96,
        opacity: 0.3,
    },
    mainIcon: {
        zIndex: 10,
    },
    shieldBadge: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 20,
    },
    sparkContainer: {
        position: 'absolute',
        top: 0,
        left: -16,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 340,
        gap: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    titleHighlight: {
        color: Colors.primary,
    },
    descHighlight: {
        color: Colors.primary,
        fontWeight: '600',
    },
});
