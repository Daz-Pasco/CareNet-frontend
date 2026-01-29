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

export default function OnboardingScreen5({ colorScheme }: Props) {
    const colors = Colors[colorScheme];
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(20)).current;
    const slideUpOpacity = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const bgPulse1 = useRef(new Animated.Value(0.5)).current;
    const bgPulse2 = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Fade in for logo
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();

        // Slide up animation
        Animated.parallel([
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideUpOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Bounce animation for inbox badge
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -10,
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

        // Background pulse animations
        Animated.loop(
            Animated.sequence([
                Animated.timing(bgPulse1, {
                    toValue: 0.7,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(bgPulse1, {
                    toValue: 0.5,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.delay(1500),
                Animated.timing(bgPulse2, {
                    toValue: 0.7,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(bgPulse2, {
                    toValue: 0.5,
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
                {/* Main circle with icons */}
                <View
                    style={[
                        styles.mainCircle,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    {/* Background folder icon */}
                    <MaterialIcons
                        name="folder-shared"
                        size={100}
                        color={colors.redLight}
                        style={styles.backgroundIcon}
                    />

                    {/* Foreground groups icon */}
                    <MaterialIcons
                        name="groups"
                        size={48}
                        color={Colors.primary}
                        style={styles.foregroundIcon}
                    />
                </View>

                {/* Bouncing inbox badge */}
                <Animated.View
                    style={[
                        styles.inboxBadgeContainer,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            transform: [{ translateY: bounceAnim }],
                        },
                    ]}
                >
                    <View style={styles.inboxBadge}>
                        <MaterialIcons
                            name="forward-to-inbox"
                            size={28}
                            color="#FFFFFF"
                        />
                    </View>
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
                    Condividi con medici e familiari
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Invita professionisti sanitari e invia report periodici automatici via email.
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
        paddingHorizontal: 24,
    },
    decorativeBlur: {
        position: 'absolute',
        borderRadius: 999,
    },
    topBlur: {
        top: '-10%',
        right: '-10%',
        width: 256,
        height: 256,
    },
    bottomBlur: {
        bottom: '-10%',
        left: '-10%',
        width: 320,
        height: 320,
    },
    logoContainer: {
        width: 80,
        height: 80,
        marginBottom: 40,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    backgroundIcon: {
        position: 'absolute',
        transform: [{ scale: 1.25 }],
    },
    foregroundIcon: {
        zIndex: 10,
    },
    inboxBadgeContainer: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        padding: 6,
        borderRadius: 999,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 20,
    },
    inboxBadge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 320,
        gap: 12,
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
});
