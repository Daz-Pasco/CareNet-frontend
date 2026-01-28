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

export default function OnboardingScreen1({ colorScheme }: Props) {
    const colors = Colors[colorScheme];
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pingAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Pulse animation for heart icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
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
        outputRange: [0.3, 0],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeIn }]}>
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

            {/* Logo */}
            <View style={[styles.logoContainer, { backgroundColor: colors.surface }]}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Main circular illustration */}
            <View style={styles.illustrationContainer}>
                {/* Outer ring */}
                <View style={[styles.outerRing, { borderColor: colors.redLighter }]}>
                    {/* Middle circle */}
                    <View
                        style={[styles.middleCircle, { backgroundColor: colors.redLighter }]}
                    >
                        {/* Ping animation ring */}
                        <Animated.View
                            style={[
                                styles.pingRing,
                                {
                                    borderColor: Colors.primary,
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

                        {/* Center heart icon */}
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
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
        elevation: 8,
        padding: 16,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    illustrationContainer: {
        width: width * 0.75,
        height: width * 0.75,
        maxWidth: 300,
        maxHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    outerRing: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleCircle: {
        width: '75%',
        height: '75%',
        borderRadius: 999,
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
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    topRightIcon: {
        top: 40,
        right: 40,
    },
    bottomLeftIcon: {
        bottom: 40,
        left: 40,
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
        maxWidth: 320,
        gap: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 36,
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
