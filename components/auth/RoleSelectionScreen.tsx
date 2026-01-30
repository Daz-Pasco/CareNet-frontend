import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Role = 'professional' | 'caregiver' | null;

interface RoleOption {
    id: Role;
    title: string;
    description: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}

const roles: RoleOption[] = [
    {
        id: 'professional',
        title: 'Professionista Sanitario',
        description: 'Gestisci pazienti, monitora i parametri vitali e invia referti.',
        icon: 'medical-services',
    },
    {
        id: 'caregiver',
        title: 'Caregiver Familiare',
        description: 'Prenditi cura dei tuoi cari, ricevi aggiornamenti e supporto quotidiano.',
        icon: 'volunteer-activism',
    },
];

interface Props {
    colorScheme?: 'light' | 'dark';
    onRoleSelected?: (role: Role) => void;
}

export default function RoleSelectionScreen({ colorScheme = 'light', onRoleSelected }: Props) {
    const colors = Colors[colorScheme];
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animations
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp1 = useRef(new Animated.Value(30)).current;
    const slideUp2 = useRef(new Animated.Value(30)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;
    const pulseAnim1 = useRef(new Animated.Value(1)).current;
    const pulseAnim2 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Staggered slide up for cards
        Animated.sequence([
            Animated.delay(100),
            Animated.timing(slideUp1, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.sequence([
            Animated.delay(200),
            Animated.timing(slideUp2, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.sequence([
            Animated.delay(300),
            Animated.timing(buttonSlide, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        // Background pulse animations
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
    }, []);

    const handleContinue = async () => {
        if (!selectedRole) return;

        setIsSubmitting(true);
        try {
            if (onRoleSelected) {
                onRoleSelected(selectedRole);
            } else {
                // Default navigation to tabs
                router.replace('/(tabs)' as any);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeIn }]}>
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

            {/* Logo and Title */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Chi sei?</Text>
            </View>

            {/* Role Cards - Centered */}
            <View style={styles.cardsContainer}>
                {roles.map((role, index) => {
                    const isSelected = selectedRole === role.id;
                    const slideAnim = index === 0 ? slideUp1 : slideUp2;

                    return (
                        <Animated.View
                            key={role.id}
                            style={{
                                transform: [{ translateY: slideAnim }],
                                opacity: fadeIn,
                            }}
                        >
                            <Pressable
                                onPress={() => setSelectedRole(role.id)}
                                style={({ pressed }) => [
                                    styles.roleCard,
                                    {
                                        backgroundColor: isSelected
                                            ? (colorScheme === 'dark' ? '#450a0a' : '#FEF2F2')
                                            : colors.surface,
                                        borderColor: isSelected
                                            ? Colors.primary
                                            : (colorScheme === 'dark' ? '#3f3f46' : '#E5E7EB'),
                                        transform: [{ scale: pressed ? 0.98 : 1 }],
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor: isSelected
                                                ? Colors.primary
                                                : colors.redLighter,
                                        },
                                    ]}
                                >
                                    <MaterialIcons
                                        name={role.icon}
                                        size={32}
                                        color={isSelected ? '#FFFFFF' : Colors.primary}
                                    />
                                </View>
                                <View style={styles.roleContent}>
                                    <Text style={[styles.roleTitle, { color: colors.text }]}>
                                        {role.title}
                                    </Text>
                                    <Text style={[styles.roleDescription, { color: colors.textMuted }]}>
                                        {role.description}
                                    </Text>
                                </View>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Continue Button */}
            <Animated.View
                style={[
                    styles.buttonContainer,
                    {
                        transform: [{ translateY: buttonSlide }],
                        opacity: fadeIn,
                    },
                ]}
            >
                <Pressable
                    onPress={handleContinue}
                    disabled={!selectedRole || isSubmitting}
                    style={({ pressed }) => [
                        styles.continueButton,
                        {
                            backgroundColor: selectedRole ? Colors.primary : '#9CA3AF',
                            opacity: selectedRole ? (pressed ? 0.9 : 1) : 0.5,
                            transform: [{ scale: pressed && selectedRole ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <Text style={styles.continueButtonText}>Continua</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
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
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        zIndex: 10,
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    cardsContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 16,
        zIndex: 10,
        paddingVertical: 20,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleContent: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    roleDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    buttonContainer: {
        paddingBottom: 48,
        paddingTop: 16,
        zIndex: 10,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
