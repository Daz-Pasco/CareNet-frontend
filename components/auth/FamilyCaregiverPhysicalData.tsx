import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    colorScheme: 'light' | 'dark';
    onContinue: (data: PhysicalData) => void;
    onBack: () => void;
    currentStep?: number;
    totalSteps?: number;
    initialData?: PhysicalData;
}

export interface PhysicalData {
    heightCm: number;
    weightKg: number;
}

export default function FamilyCaregiverPhysicalData({
    colorScheme,
    onContinue,
    onBack,
    currentStep = 2,
    totalSteps = 4,
    initialData,
}: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Form state
    const [height, setHeight] = useState(initialData?.heightCm || 170);
    const [weight, setWeight] = useState(initialData?.weightKg || 70);

    // Animation refs - Main
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const iconScale = useRef(new Animated.Value(0.8)).current;

    // Staggered card animations
    const card1Anim = useRef(new Animated.Value(0)).current;
    const card1Slide = useRef(new Animated.Value(30)).current;
    const card2Anim = useRef(new Animated.Value(0)).current;
    const card2Slide = useRef(new Animated.Value(30)).current;

    // Button animation
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

    // Value change animations
    const heightBounce = useRef(new Animated.Value(1)).current;
    const weightBounce = useRef(new Animated.Value(1)).current;

    // Background pulse
    const pulseAnim1 = useRef(new Animated.Value(1)).current;
    const pulseAnim2 = useRef(new Animated.Value(1)).current;

    // Icon glow pulse
    const glowPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Main fade in
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(iconScale, {
                toValue: 1,
                friction: 4,
                tension: 80,
                useNativeDriver: true,
            }),
        ]).start();

        // Staggered card animations
        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(card1Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(card1Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(350),
            Animated.parallel([
                Animated.timing(card2Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(card2Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        // Button entrance
        Animated.sequence([
            Animated.delay(500),
            Animated.parallel([
                Animated.timing(buttonAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(buttonSlide, { toValue: 0, friction: 6, tension: 60, useNativeDriver: true }),
            ]),
        ]).start();

        // Background pulse animations
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim1, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim1, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim2, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
                    Animated.timing(pulseAnim2, { toValue: 1, duration: 2000, useNativeDriver: true }),
                ])
            ).start();
        }, 1000);

        // Icon glow pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowPulse, { toValue: 1.15, duration: 1500, useNativeDriver: true }),
                Animated.timing(glowPulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // Bounce animation when value changes
    const animateValueChange = (bounceAnim: Animated.Value) => {
        Animated.sequence([
            Animated.timing(bounceAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
            Animated.spring(bounceAnim, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true }),
        ]).start();
    };

    const handleContinue = () => {
        onContinue({
            heightCm: height,
            weightKg: weight,
        });
    };

    const adjustHeight = (delta: number) => {
        setHeight(prev => Math.max(50, Math.min(250, prev + delta)));
        animateValueChange(heightBounce);
    };

    const adjustWeight = (delta: number) => {
        setWeight(prev => Math.max(20, Math.min(300, prev + delta)));
        animateValueChange(weightBounce);
    };

    const isFormValid = height > 0 && weight > 0;

    const progressWidth = `${(currentStep / totalSteps) * 100}%`;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background decorative blurs with pulse */}
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

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
                <Pressable
                    onPress={onBack}
                    style={({ pressed }) => [
                        styles.backButton,
                        { backgroundColor: pressed ? colors.border : 'transparent' },
                    ]}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </Pressable>

                <View style={styles.progressContainer}>
                    <Text style={[styles.stepText, { color: Colors.primary }]}>
                        Passaggio {currentStep} di {totalSteps}
                    </Text>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: progressWidth as any, backgroundColor: Colors.primary }
                            ]}
                        />
                    </View>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        },
                    ]}
                >
                    {/* Icon with glow pulse */}
                    <View style={styles.iconContainer}>
                        <Animated.View
                            style={[
                                styles.iconGlow,
                                {
                                    backgroundColor: colors.redLighter,
                                    transform: [{ scale: glowPulse }],
                                }
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.iconCircle,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    transform: [{ scale: iconScale }],
                                },
                            ]}
                        >
                            <MaterialIcons name="monitor-weight" size={56} color={Colors.primary} />
                        </Animated.View>
                    </View>

                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Dati fisici
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                            Queste informazioni ci aiutano a personalizzare i parametri di salute.
                        </Text>
                    </View>

                    {/* Height Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card1Anim, transform: [{ translateY: card1Slide }] }
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.cardLabel}>
                                <MaterialIcons name="height" size={20} color={Colors.primary} />
                                <Text style={[styles.cardLabelText, { color: colors.text }]}>
                                    Altezza
                                </Text>
                            </View>
                            <View style={[styles.unitBadge, { backgroundColor: colors.redLighter }]}>
                                <Text style={[styles.unitText, { color: Colors.primary }]}>CM</Text>
                            </View>
                        </View>
                        <View style={styles.cardContent}>
                            <Pressable
                                onPress={() => adjustHeight(-1)}
                                style={({ pressed }) => [
                                    styles.adjustButton,
                                    {
                                        backgroundColor: pressed ? colors.redLighter : colors.background,
                                        transform: [{ scale: pressed ? 0.9 : 1 }],
                                    },
                                ]}
                            >
                                <MaterialIcons name="remove" size={24} color={Colors.primary} />
                            </Pressable>
                            <View style={styles.valueContainer}>
                                <Animated.Text
                                    style={[
                                        styles.valueText,
                                        { color: colors.text, transform: [{ scale: heightBounce }] }
                                    ]}
                                >
                                    {height}
                                </Animated.Text>
                                <Text style={[styles.valueSuffix, { color: colors.textMuted }]}>cm</Text>
                            </View>
                            <Pressable
                                onPress={() => adjustHeight(1)}
                                style={({ pressed }) => [
                                    styles.adjustButton,
                                    {
                                        backgroundColor: pressed ? colors.redLighter : colors.background,
                                        transform: [{ scale: pressed ? 0.9 : 1 }],
                                    },
                                ]}
                            >
                                <MaterialIcons name="add" size={24} color={Colors.primary} />
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Weight Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card2Anim, transform: [{ translateY: card2Slide }] }
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.cardLabel}>
                                <MaterialIcons name="fitness-center" size={20} color={Colors.primary} />
                                <Text style={[styles.cardLabelText, { color: colors.text }]}>
                                    Peso
                                </Text>
                            </View>
                            <View style={[styles.unitBadge, { backgroundColor: colors.redLighter }]}>
                                <Text style={[styles.unitText, { color: Colors.primary }]}>KG</Text>
                            </View>
                        </View>
                        <View style={styles.cardContent}>
                            <Pressable
                                onPress={() => adjustWeight(-1)}
                                style={({ pressed }) => [
                                    styles.adjustButton,
                                    {
                                        backgroundColor: pressed ? colors.redLighter : colors.background,
                                        transform: [{ scale: pressed ? 0.9 : 1 }],
                                    },
                                ]}
                            >
                                <MaterialIcons name="remove" size={24} color={Colors.primary} />
                            </Pressable>
                            <View style={styles.valueContainer}>
                                <Animated.Text
                                    style={[
                                        styles.valueText,
                                        { color: colors.text, transform: [{ scale: weightBounce }] }
                                    ]}
                                >
                                    {weight}
                                </Animated.Text>
                                <Text style={[styles.valueSuffix, { color: colors.textMuted }]}>kg</Text>
                            </View>
                            <Pressable
                                onPress={() => adjustWeight(1)}
                                style={({ pressed }) => [
                                    styles.adjustButton,
                                    {
                                        backgroundColor: pressed ? colors.redLighter : colors.background,
                                        transform: [{ scale: pressed ? 0.9 : 1 }],
                                    },
                                ]}
                            >
                                <MaterialIcons name="add" size={24} color={Colors.primary} />
                            </Pressable>
                        </View>
                    </Animated.View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Button */}
            <Animated.View
                style={[
                    styles.bottomContainer,
                    { paddingBottom: Math.max(insets.bottom, 24) },
                    { opacity: buttonAnim, transform: [{ translateY: buttonSlide }] }
                ]}
            >
                <Pressable
                    onPress={handleContinue}
                    disabled={!isFormValid}
                    style={({ pressed }) => [
                        styles.continueButton,
                        {
                            backgroundColor: isFormValid ? Colors.primary : colors.border,
                            opacity: pressed && isFormValid ? 0.9 : 1,
                            transform: [{ scale: pressed && isFormValid ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <Text style={[
                        styles.continueButtonText,
                        { color: isFormValid ? '#FFFFFF' : colors.textMuted },
                    ]}>
                        Continua
                    </Text>
                    <MaterialIcons
                        name="arrow-forward"
                        size={20}
                        color={isFormValid ? '#FFFFFF' : colors.textMuted}
                    />
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 12,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    progressContainer: {
        alignItems: 'flex-end',
    },
    stepText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    progressBar: {
        width: 96,
        height: 6,
        borderRadius: 3,
        marginTop: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    scrollView: {
        flex: 1,
        zIndex: 10,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 120,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        overflow: 'visible',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
        overflow: 'visible',
    },
    iconGlow: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        opacity: 0.5,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardLabelText: {
        fontSize: 16,
        fontWeight: '600',
    },
    unitBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    unitText: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    adjustButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    valueText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    valueSuffix: {
        fontSize: 18,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 16,
        zIndex: 20,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
