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

export default function OnboardingScreen4({ colorScheme }: Props) {
    const colors = Colors[colorScheme];
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(20)).current;
    const slideUpOpacity = useRef(new Animated.Value(0)).current;

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
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background decorative blurs */}
            <View
                style={[
                    styles.decorativeBlur,
                    styles.topBlur,
                    { backgroundColor: colors.redLight },
                ]}
            />
            <View
                style={[
                    styles.decorativeBlur,
                    styles.bottomBlur,
                    { backgroundColor: colorScheme === 'dark' ? '#27272A33' : '#E5E7EB' },
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
                {/* Background circle */}
                <View style={[styles.bgCircle, { backgroundColor: colors.surface }]} />

                {/* Calendar icon - behind and rotated left */}
                <View
                    style={[
                        styles.calendarCard,
                        {
                            backgroundColor: colors.redLighter,
                            borderColor: colors.redLight,
                        },
                    ]}
                >
                    <MaterialIcons
                        name="event-available"
                        size={56}
                        color={`${Colors.primary}99`}
                    />
                </View>

                {/* Main medication card */}
                <View
                    style={[
                        styles.medicationCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <MaterialIcons
                        name="medication"
                        size={72}
                        color={Colors.primary}
                    />

                    {/* Green checkmark badge */}
                    <View style={styles.checkBadge}>
                        <MaterialIcons
                            name="check"
                            size={16}
                            color="#FFFFFF"
                        />
                    </View>
                </View>
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
                    Gestisci <Text style={styles.titleHighlight}>farmaci</Text> e{'\n'}<Text style={styles.titleHighlight}>appuntamenti</Text>
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Promemoria <Text style={styles.descHighlight}>automatici</Text> per medicine e visite mediche, con conferme dall'anziano.
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
        opacity: 0.6,
    },
    topBlur: {
        top: '-10%',
        right: '-20%',
        width: 384,
        height: 384,
    },
    bottomBlur: {
        bottom: '10%',
        left: '-10%',
        width: 320,
        height: 320,
    },
    logoContainer: {
        width: 64,
        height: 64,
        marginBottom: 16,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    illustrationContainer: {
        width: 256,
        height: 256,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgCircle: {
        position: 'absolute',
        width: 230,
        height: 230,
        borderRadius: 115,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 4,
    },
    calendarCard: {
        position: 'absolute',
        left: 20,
        top: 40,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        transform: [{ rotate: '-12deg' }],
    },
    medicationCard: {
        position: 'relative',
        zIndex: 10,
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        transform: [{ rotate: '3deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    checkBadge: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: Colors.primary,
        borderRadius: 999,
        padding: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
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
        lineHeight: 34,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 8,
    },
    titleHighlight: {
        color: Colors.primary,
    },
    descHighlight: {
        color: Colors.primary,
        fontWeight: '600',
    },
});
