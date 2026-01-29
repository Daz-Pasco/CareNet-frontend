import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface Props {
    colorScheme: 'light' | 'dark';
    onGoogleLogin?: () => void;
    onBack?: () => void;
}

// Google Logo SVG Component
function GoogleLogo() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <Path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <Path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <Path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </Svg>
    );
}

export default function LoginScreen({ colorScheme, onGoogleLogin, onBack }: Props) {
    const colors = Colors[colorScheme];

    // Animation values
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(20)).current;
    const logoSlideDown = useRef(new Animated.Value(-20)).current;
    const pulseAnim1 = useRef(new Animated.Value(1)).current;
    const pulseAnim2 = useRef(new Animated.Value(1)).current;
    const bounceAnim1 = useRef(new Animated.Value(0)).current;
    const bounceAnim2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();

        // Logo slide down animation
        Animated.timing(logoSlideDown, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Slide up animation for content
        Animated.timing(slideUp, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Pulse animation 1 (outer ring)
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim1, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim1, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Pulse animation 2 (inner ring) with delay
        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim2, {
                        toValue: 1.1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim2, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, 750);

        // Bounce animation for verified icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim1, {
                    toValue: -8,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim1, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Bounce animation for sensors icon with delay
        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim2, {
                        toValue: -8,
                        duration: 1750,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim2, {
                        toValue: 0,
                        duration: 1750,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, 500);
    }, []);

    const handleTermsPress = () => {
        Linking.openURL('#'); // Replace with actual Terms URL
    };

    const handlePrivacyPress = () => {
        Linking.openURL('#'); // Replace with actual Privacy URL
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Back button */}
            {onBack && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
            )}

            {/* Background decorative blurs */}
            <View style={styles.backgroundBlurs}>
                <Animated.View
                    style={[
                        styles.decorativeBlur,
                        styles.topBlur,
                        {
                            backgroundColor: colors.redLight,
                            transform: [{ scale: pulseAnim1 }],
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.decorativeBlur,
                        styles.bottomBlur,
                        {
                            backgroundColor: colors.redLighter,
                            transform: [{ scale: pulseAnim2 }],
                        },
                    ]}
                />
            </View>

            {/* Logo at top */}
            <Animated.View
                style={[
                    styles.logoWrapper,
                    {
                        opacity: fadeIn,
                        transform: [{ translateY: logoSlideDown }],
                    },
                ]}
            >
                <View style={styles.logoShadow}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                {/* Welcome text */}
                <Text style={[styles.welcomeText, { color: colors.text }]}>
                    Benvenuto
                </Text>
            </Animated.View>

            {/* Main content area */}
            <View style={styles.mainContent}>
                {/* Circular illustration */}
                <Animated.View
                    style={[
                        styles.illustrationWrapper,
                        {
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        },
                    ]}
                >
                    {/* Outer pulse ring */}
                    <Animated.View
                        style={[
                            styles.pulseRingOuter,
                            {
                                backgroundColor: colors.redLighter,
                                transform: [{ scale: pulseAnim1 }],
                            },
                        ]}
                    />
                    {/* Inner pulse ring */}
                    <Animated.View
                        style={[
                            styles.pulseRingInner,
                            {
                                backgroundColor: colors.redLight,
                                transform: [{ scale: pulseAnim2 }],
                            },
                        ]}
                    />

                    {/* Main circle */}
                    <View
                        style={[
                            styles.mainCircle,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                            },
                        ]}
                    >
                        <MaterialIcons
                            name="health-and-safety"
                            size={96}
                            color={Colors.primary}
                        />
                    </View>

                    {/* Verified badge - top right */}
                    <Animated.View
                        style={[
                            styles.floatingBadge,
                            styles.verifiedBadge,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F9FAFB',
                                transform: [{ translateY: bounceAnim1 }],
                            },
                        ]}
                    >
                        <MaterialIcons name="verified" size={24} color={Colors.primary} />
                    </Animated.View>

                    {/* Sensors badge - bottom left */}
                    <Animated.View
                        style={[
                            styles.floatingBadge,
                            styles.sensorsBadge,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F9FAFB',
                                transform: [{ translateY: bounceAnim2 }],
                            },
                        ]}
                    >
                        <MaterialIcons name="sensors" size={24} color={Colors.primary} />
                    </Animated.View>
                </Animated.View>

                {/* Text content */}
                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        },
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        <Text style={styles.titleHighlight}>CareNet</Text> Companion
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        Il tuo ambiente <Text style={styles.subtitleHighlight}>sicuro</Text> e sempre <Text style={styles.subtitleHighlight}>connesso</Text>.
                    </Text>
                </Animated.View>
            </View>

            {/* Bottom section with button */}
            <Animated.View
                style={[
                    styles.bottomSection,
                    {
                        opacity: fadeIn,
                        transform: [{ translateY: slideUp }],
                    },
                ]}
            >
                {/* Google Login Button */}
                <Pressable
                    onPress={onGoogleLogin}
                    style={({ pressed }) => [
                        styles.googleButton,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colorScheme === 'dark' ? '#52525B' : '#D1D5DB',
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <GoogleLogo />
                    <Text style={[styles.googleButtonText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#374151' }]}>
                        Continua con Google
                    </Text>
                </Pressable>

                {/* Terms and Privacy */}
                <Text style={[styles.legalText, { color: colors.textMuted }]}>
                    Accedendo, accetti i nostri{' '}
                    <Text style={styles.legalLink} onPress={handleTermsPress}>
                        Termini di Servizio
                    </Text>
                    {' '}e la{' '}
                    <Text style={styles.legalLink} onPress={handlePrivacyPress}>
                        Privacy Policy
                    </Text>
                    .
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    backgroundBlurs: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
    },
    decorativeBlur: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.5,
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
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 8,
        zIndex: 100,
    },
    logoWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 8,
        zIndex: 10,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 12,
        letterSpacing: -0.5,
    },
    logoShadow: {
        width: 80,
        height: 80,
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
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    illustrationWrapper: {
        width: 280,
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48,
    },
    pulseRingOuter: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
    },
    pulseRingInner: {
        position: 'absolute',
        width: 230,
        height: 230,
        borderRadius: 115,
    },
    mainCircle: {
        width: 192,
        height: 192,
        borderRadius: 96,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
        zIndex: 10,
    },
    floatingBadge: {
        position: 'absolute',
        padding: 8,
        borderRadius: 999,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        zIndex: 20,
    },
    verifiedBadge: {
        top: -8,
        right: 24,
    },
    sensorsBadge: {
        bottom: 16,
        left: -8,
    },
    textContainer: {
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
    },
    titleHighlight: {
        color: Colors.primary,
    },
    subtitleHighlight: {
        color: Colors.primary,
        fontWeight: '600',
    },
    bottomSection: {
        width: '100%',
        paddingHorizontal: 32,
        paddingBottom: 48,
        paddingTop: 16,
        alignItems: 'center',
        zIndex: 10,
    },
    googleButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    legalText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 20,
        maxWidth: 300,
    },
    legalLink: {
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
});
