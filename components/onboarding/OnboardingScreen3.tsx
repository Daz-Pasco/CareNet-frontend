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

export default function OnboardingScreen3({ colorScheme }: Props) {
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const bounceAnim1 = useRef(new Animated.Value(0)).current;
    const bounceAnim2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Bounce animation for check icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim1, {
                    toValue: -8,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim1, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Bounce animation for notification icon (delayed)
        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim2, {
                        toValue: -8,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim2, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, 1500);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeIn }]}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Main card illustration */}
            <View style={styles.illustrationContainer}>
                {/* Background blur */}
                <View
                    style={[
                        styles.backgroundBlur,
                        { backgroundColor: Colors.primary + (colorScheme === 'dark' ? '33' : '1A') },
                    ]}
                />

                {/* Main card */}
                <View
                    style={[
                        styles.mainCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colorScheme === 'dark' ? '#3f3f46' : '#f3f4f6',
                        },
                    ]}
                >
                    {/* Appointment row */}
                    <View style={[styles.cardRow, styles.cardRowBorder, { borderColor: colorScheme === 'dark' ? '#3f3f46' : '#f3f4f6' }]}>
                        <View style={[styles.iconBox, { backgroundColor: colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }]}>
                            <MaterialIcons
                                name="event"
                                size={24}
                                color={colorScheme === 'dark' ? '#60a5fa' : '#2563eb'}
                            />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>
                                Visita Cardiologica
                            </Text>
                            <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                                Domani, 10:00
                            </Text>
                        </View>
                    </View>

                    {/* Medication row */}
                    <View style={styles.cardRow}>
                        <View style={[styles.iconBox, { backgroundColor: colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2' }]}>
                            <MaterialIcons
                                name="medication"
                                size={24}
                                color={Colors.primary}
                            />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>
                                Aspirina
                            </Text>
                            <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                                1 compressa dopo pranzo
                            </Text>
                        </View>
                        <View style={styles.checkboxOuter}>
                            <View style={styles.checkboxInner} />
                        </View>
                    </View>
                </View>

                {/* Floating check icon */}
                <Animated.View
                    style={[
                        styles.floatingIcon,
                        styles.floatingIconRight,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colorScheme === 'dark' ? '#3f3f46' : '#f3f4f6',
                            transform: [{ translateY: bounceAnim1 }],
                        },
                    ]}
                >
                    <MaterialIcons name="check-circle" size={24} color="#22c55e" />
                </Animated.View>

                {/* Floating notification icon */}
                <Animated.View
                    style={[
                        styles.floatingIcon,
                        styles.floatingIconLeft,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colorScheme === 'dark' ? '#3f3f46' : '#f3f4f6',
                            transform: [{ translateY: bounceAnim2 }],
                        },
                    ]}
                >
                    <MaterialIcons name="notifications-active" size={24} color="#f59e0b" />
                </Animated.View>
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colorScheme === 'dark' ? '#ffffff' : colors.text }]}>
                    Gestisci farmaci e appuntamenti
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Promemoria automatici per medicine e visite mediche, con conferme dall'anziano.
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
        marginBottom: 32,
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
    backgroundBlur: {
        position: 'absolute',
        width: '75%',
        height: '75%',
        borderRadius: 999,
        opacity: 0.6,
    },
    mainCard: {
        width: 256,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        zIndex: 10,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    cardRowBorder: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    iconBox: {
        padding: 12,
        borderRadius: 12,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 12,
    },
    checkboxOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    floatingIcon: {
        position: 'absolute',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    floatingIconRight: {
        right: -16,
        top: 40,
    },
    floatingIconLeft: {
        left: -8,
        bottom: 48,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 320,
        gap: 16,
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
