import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type Role = 'professional' | 'caregiver' | null;

interface RoleOption {
    id: Role;
    title: string;
    description: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    badge: string;
}

const roles: RoleOption[] = [
    {
        id: 'professional',
        title: 'Professionista Sanitario',
        description: 'Gestisci pazienti, monitora i parametri vitali e invia referti.',
        icon: 'medical-services',
        badge: 'Medico / Infermiere',
    },
    {
        id: 'caregiver',
        title: 'Caregiver Familiare',
        description: 'Prenditi cura dei tuoi cari, ricevi aggiornamenti e supporto quotidiano.',
        icon: 'volunteer-activism',
        badge: 'Familiare / Assistente',
    },
];

interface Props {
    colorScheme?: 'light' | 'dark';
    onRoleSelected?: (role: Role) => void;
}

export default function RoleSelectionScreen({ colorScheme = 'light', onRoleSelected }: Props) {
    const colors = Colors[colorScheme];
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedRole, setSelectedRole] = useState<Role>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animations
    const fadeIn = useRef(new Animated.Value(0)).current;
    const titleSlide = useRef(new Animated.Value(20)).current;
    const slideUp1 = useRef(new Animated.Value(40)).current;
    const scale1 = useRef(new Animated.Value(0.95)).current;
    const slideUp2 = useRef(new Animated.Value(40)).current;
    const scale2 = useRef(new Animated.Value(0.95)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;
    const pulseAnim1 = useRef(new Animated.Value(1)).current;
    const pulseAnim2 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        // Title slide
        Animated.timing(titleSlide, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Staggered slide up for cards with spring
        Animated.sequence([
            Animated.delay(150),
            Animated.parallel([
                Animated.timing(slideUp1, { toValue: 0, duration: 450, useNativeDriver: true }),
                Animated.spring(scale1, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(280),
            Animated.parallel([
                Animated.timing(slideUp2, { toValue: 0, duration: 450, useNativeDriver: true }),
                Animated.spring(scale2, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(400),
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
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim1, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim2, {
                        toValue: 1.1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim2, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, 1000);
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

    const getSlideAnim = (index: number) => index === 0 ? slideUp1 : slideUp2;
    const getScaleAnim = (index: number) => index === 0 ? scale1 : scale2;

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

            {/* Back Button */}
            <View style={[styles.headerNav, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                <Pressable
                    onPress={() => router.replace('/onboarding' as any)}
                    style={({ pressed }) => [
                        styles.backButton,
                        { backgroundColor: pressed ? colors.border : colors.surface }
                    ]}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 80 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Logo and Title */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeIn,
                            transform: [{ translateY: titleSlide }],
                        }
                    ]}
                >
                    <View style={[styles.logoContainer, { backgroundColor: 'transparent' }]}>
                        <Image
                            source={require('@/assets/images/carenet-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Chi sei?</Text>
                </Animated.View>

                {/* Role Cards */}
                <View style={styles.cardsContainer}>
                    {roles.map((role, index) => {
                        const isSelected = selectedRole === role.id;
                        const slideAnim = getSlideAnim(index);
                        const scaleAnim = getScaleAnim(index);

                        return (
                            <Animated.View
                                key={role.id}
                                style={{
                                    transform: [
                                        { translateY: slideAnim },
                                        { scale: scaleAnim },
                                    ],
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
                                                : 'transparent',
                                            borderWidth: 2,
                                            transform: [{ scale: pressed ? 0.98 : 1 }],
                                        },
                                    ]}
                                >
                                    {/* Selection indicator */}
                                    <View style={styles.cardTopRow}>
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
                                                size={28}
                                                color={isSelected ? '#FFFFFF' : Colors.primary}
                                            />
                                        </View>
                                        <View style={[
                                            styles.radioOuter,
                                            { borderColor: isSelected ? Colors.primary : colors.border }
                                        ]}>
                                            {isSelected && (
                                                <View style={[styles.radioInner, { backgroundColor: Colors.primary }]} />
                                            )}
                                        </View>
                                    </View>

                                    <Text style={[styles.roleTitle, { color: colors.text }]}>
                                        {role.title}
                                    </Text>
                                    <Text style={[styles.roleDescription, { color: colors.textMuted }]}>
                                        {role.description}
                                    </Text>

                                    {/* Badge */}
                                    <View style={[styles.badge, { backgroundColor: isSelected ? colors.redLighter : colors.background }]}>
                                        <MaterialIcons
                                            name={role.id === 'professional' ? 'badge' : 'favorite'}
                                            size={14}
                                            color={isSelected ? Colors.primary : colors.textMuted}
                                        />
                                        <Text style={[styles.badgeText, { color: isSelected ? Colors.primary : colors.textMuted }]}>
                                            {role.badge}
                                        </Text>
                                    </View>
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Continue Button - Fixed at bottom */}
            <Animated.View
                style={[
                    styles.buttonContainer,
                    {
                        paddingBottom: Math.max(insets.bottom, 24),
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
                            backgroundColor: selectedRole ? Colors.primary : colors.border,
                            opacity: selectedRole ? (pressed ? 0.9 : 1) : 0.7,
                            transform: [{ scale: pressed && selectedRole ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <Text style={[styles.continueButtonText, { color: selectedRole ? '#FFFFFF' : colors.textMuted }]}>
                        Continua
                    </Text>
                    <MaterialIcons
                        name="arrow-forward"
                        size={20}
                        color={selectedRole ? '#FFFFFF' : colors.textMuted}
                    />
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
        width: 280,
        height: 280,
    },
    bottomBlur: {
        bottom: '-10%',
        left: '-10%',
        width: 350,
        height: 350,
    },
    headerNav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 0,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scrollView: {
        flex: 1,
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 4,
        zIndex: 10,
    },
    logoContainer: {
        width: 100,
        height: 100,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
    cardsContainer: {
        justifyContent: 'flex-start',
        gap: 16,
        zIndex: 10,
        paddingTop: 8,
        marginBottom: 24,
    },
    roleCard: {
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    roleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    roleDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 14,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 'auto',
        paddingTop: 16,
        paddingBottom: 8,
        zIndex: 10,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
});
