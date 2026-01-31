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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Props {
    colorScheme: 'light' | 'dark';
}

export default function OnboardingScreen1({ colorScheme }: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pingAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideDown = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        // Fade in and slide down animation for logo
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideDown, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animation for heart icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Ping animation for the ring
        Animated.loop(
            Animated.sequence([
                Animated.timing(pingAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pingAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const pingScale = pingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.5],
    });

    const pingOpacity = pingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 0],
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeIn }]}>
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
                    { backgroundColor: colors.redLighter },
                ]}
            />

            {/* Logo with slide down animation */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        top: insets.top,
                        transform: [{ translateY: slideDown }],
                    }
                ]}
            >
                <Image
                    source={require('@/assets/images/carenet-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Main circular illustration */}
            <View style={styles.illustrationContainer}>
                {/* Outer ring */}
                <View style={[styles.outerRing, { borderColor: colors.redLight }]}>
                    {/* Middle circle */}
                    <View
                        style={[styles.middleCircle, { backgroundColor: colors.redLighter }]}
                    >
                        {/* Ping animation ring */}
                        <Animated.View
                            style={[
                                styles.pingRing,
                                {
                                    borderColor: `${Colors.primary}33`,
                                    transform: [{ scale: pingScale }],
                                    opacity: pingOpacity,
                                },
                            ]}
                        />

                        {/* Location icon - top right */}
                        <View
                            style={[
                                styles.floatingIcon,
                                styles.topRightIcon,
                                { backgroundColor: colors.surface },
                            ]}
                        >
                            <MaterialIcons
                                name="location-on"
                                size={24}
                                color={Colors.primary}
                            />
                        </View>

                        {/* Walking icon - bottom left */}
                        <View
                            style={[
                                styles.floatingIcon,
                                styles.bottomLeftIcon,
                                { backgroundColor: colors.surface },
                            ]}
                        >
                            <MaterialIcons
                                name="directions-walk"
                                size={24}
                                color={Colors.primary}
                            />
                        </View>

                        {/* Center heart icon with pulse */}
                        <Animated.View
                            style={[
                                styles.centerIcon,
                                {
                                    backgroundColor: colors.surface,
                                    transform: [{ scale: pulseAnim }],
                                },
                            ]}
                        >
                            <MaterialIcons
                                name="favorite"
                                size={40}
                                color={Colors.primary}
                            />
                        </Animated.View>
                    </View>
                </View>

                {/* Dashed circle decoration */}
                <View style={styles.dashedCircle} />
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Monitora la salute{'\n'}
                    <Text style={styles.titleHighlight}>in tempo reale</Text>
                </Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>
                    Tracciamo automaticamente passi, movimento e posizione per garantire
                    la sicurezza del tuo caro.
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
        borderRadius: 999,
        opacity: 0.6,
    },
    topBlur: {
        top: '-10%',
        right: '-10%',
        width: 256,
        height: 256,
    },
    bottomBlur: {
        bottom: '-5%',
        left: '-10%',
        width: 192,
        height: 192,
    },
    logoContainer: {
        position: 'absolute',
        top: 5,
        alignSelf: 'center',
        width: 100,
        height: 100,
        zIndex: 20,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    illustrationContainer: {
        width: width * 0.8,
        height: width * 0.8,
        maxWidth: 320,
        maxHeight: 320,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        marginBottom: 24,
    },
    outerRing: {
        width: 256,
        height: 256,
        borderRadius: 128,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleCircle: {
        width: 192,
        height: 192,
        borderRadius: 96,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    pingRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 999,
        borderWidth: 1,
    },
    floatingIcon: {
        position: 'absolute',
        padding: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    topRightIcon: {
        top: 5,
        right: 10,
    },
    bottomLeftIcon: {
        bottom: 20,
        left: 10,
    },
    centerIcon: {
        padding: 16,
        borderRadius: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    dashedCircle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        opacity: 0.2,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 340,
        gap: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 40,
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
