import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
    colorScheme: 'light' | 'dark';
}

export default function OnboardingScreen5({ colorScheme }: Props) {
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(20)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in and slide up animation
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animation for decorative blur
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeIn,
                    transform: [{ translateY: slideUp }],
                },
            ]}
        >
            {/* Logo */}
            <View style={[styles.logoContainer, { backgroundColor: colorScheme === 'dark' ? colors.surface : '#FFFFFF' }]}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Main card illustration */}
            <View style={styles.illustrationContainer}>
                {/* Decorative blurs */}
                <Animated.View
                    style={[
                        styles.decorativeBlur,
                        styles.topRightBlur,
                        {
                            backgroundColor: colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
                            transform: [{ scale: pulseAnim }],
                        },
                    ]}
                />
                <View
                    style={[
                        styles.decorativeBlur,
                        styles.bottomLeftBlur,
                        { backgroundColor: colorScheme === 'dark' ? 'rgba(251, 146, 60, 0.2)' : '#ffedd5' },
                    ]}
                />

                {/* Main card */}
                <View
                    style={[
                        styles.mainCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6',
                        },
                    ]}
                >
                    {/* Icons grid */}
                    <View style={styles.iconsGrid}>
                        {/* Medical icon */}
                        <View style={styles.iconColumn}>
                            <View style={[styles.iconCircle, { backgroundColor: colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff' }]}>
                                <MaterialIcons
                                    name="medical-services"
                                    size={24}
                                    color={colorScheme === 'dark' ? '#60a5fa' : '#2563eb'}
                                />
                            </View>
                            <Text style={[styles.iconLabel, { color: colors.textMuted }]}>Medici</Text>
                        </View>

                        {/* Family icon */}
                        <View style={styles.iconColumn}>
                            <View style={[styles.iconCircle, { backgroundColor: colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#f0fdf4' }]}>
                                <MaterialIcons
                                    name="family-restroom"
                                    size={24}
                                    color={colorScheme === 'dark' ? '#4ade80' : '#16a34a'}
                                />
                            </View>
                            <Text style={[styles.iconLabel, { color: colors.textMuted }]}>Famiglia</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb' }]} />
                    </View>

                    {/* Email notification card */}
                    <View
                        style={[
                            styles.emailCard,
                            {
                                backgroundColor: colors.background,
                                borderColor: colorScheme === 'dark' ? '#374151' : '#f3f4f6',
                            },
                        ]}
                    >
                        <View style={[styles.emailIconBox, { backgroundColor: Colors.primary + '1A' }]}>
                            <MaterialIcons name="mark-email-read" size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.emailTextContainer}>
                            <View style={[styles.emailLine, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb' }]} />
                            <View style={[styles.emailLineShort, { backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6' }]} />
                        </View>
                        <MaterialIcons name="check-circle" size={18} color="#22c55e" />
                    </View>
                </View>
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Condividi con medici{'\n'}e familiari
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Invita professionisti sanitari e invia report periodici automatici via email per mantenere tutti aggiornati.
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
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
        padding: 16,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    illustrationContainer: {
        width: width * 0.85,
        maxWidth: 320,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 32,
    },
    decorativeBlur: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.8,
    },
    topRightBlur: {
        top: 0,
        right: 0,
        width: 192,
        height: 192,
    },
    bottomLeftBlur: {
        bottom: 0,
        left: 0,
        width: 160,
        height: 160,
    },
    mainCard: {
        width: '100%',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    iconsGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 48,
        marginBottom: 24,
    },
    iconColumn: {
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    dividerContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
    },
    emailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    emailIconBox: {
        padding: 8,
        borderRadius: 8,
    },
    emailTextContainer: {
        flex: 1,
        gap: 6,
    },
    emailLine: {
        height: 8,
        width: 96,
        borderRadius: 4,
    },
    emailLineShort: {
        height: 6,
        width: 64,
        borderRadius: 3,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 320,
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 32,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 26,
    },
});
