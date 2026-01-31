import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    colorScheme: 'light' | 'dark';
    onContinue: (data: AddressData) => void;
    onBack: () => void;
    currentStep?: number;
    totalSteps?: number;
    initialData?: AddressData;
}

export interface AddressData {
    address: string;
}

export default function FamilyCaregiverAddress({
    colorScheme,
    onContinue,
    onBack,
    currentStep = 3,
    totalSteps = 4,
    initialData,
}: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Form state
    const [address, setAddress] = useState(initialData?.address || '');

    // Animation refs - Main
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

    // Pin bounce
    const pinBounce = useRef(new Animated.Value(0)).current;

    // Staggered element animations
    const mapAnim = useRef(new Animated.Value(0)).current;
    const mapScale = useRef(new Animated.Value(0.95)).current;
    const inputAnim = useRef(new Animated.Value(0)).current;
    const inputSlide = useRef(new Animated.Value(20)).current;
    const optionsAnim = useRef(new Animated.Value(0)).current;
    const optionsSlide = useRef(new Animated.Value(20)).current;
    const badgesAnim = useRef(new Animated.Value(0)).current;

    // Button animation
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

    // Background pulse
    const pulseAnim1 = useRef(new Animated.Value(1)).current;
    const pulseAnim2 = useRef(new Animated.Value(1)).current;

    // Pin glow
    const pinGlow = useRef(new Animated.Value(0.5)).current;

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
        ]).start();

        // Map card animation
        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(mapAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.spring(mapScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        // Input animation
        Animated.sequence([
            Animated.delay(350),
            Animated.parallel([
                Animated.timing(inputAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(inputSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Quick options animation
        Animated.sequence([
            Animated.delay(450),
            Animated.parallel([
                Animated.timing(optionsAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(optionsSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Badges animation
        Animated.sequence([
            Animated.delay(550),
            Animated.timing(badgesAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();

        // Button entrance
        Animated.sequence([
            Animated.delay(600),
            Animated.parallel([
                Animated.timing(buttonAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(buttonSlide, { toValue: 0, friction: 6, tension: 60, useNativeDriver: true }),
            ]),
        ]).start();

        // Pin bounce animation loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(pinBounce, {
                    toValue: -12,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pinBounce, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Pin glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pinGlow, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(pinGlow, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Background pulse animations
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim1, { toValue: 1.1, duration: 2500, useNativeDriver: true }),
                Animated.timing(pulseAnim1, { toValue: 1, duration: 2500, useNativeDriver: true }),
            ])
        ).start();

        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim2, { toValue: 1.1, duration: 2500, useNativeDriver: true }),
                    Animated.timing(pulseAnim2, { toValue: 1, duration: 2500, useNativeDriver: true }),
                ])
            ).start();
        }, 1250);
    }, []);

    const handleContinue = () => {
        onContinue({ address });
    };

    const isFormValid = address.trim().length > 0;

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
                keyboardShouldPersistTaps="handled"
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
                    {/* Title */}
                    <Text style={[styles.title, { color: colors.text }]}>
                        Indirizzo di casa
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        Aggiungi l'indirizzo del tuo assistito per consentire ai servizi di emergenza di raggiungerlo rapidamente.
                    </Text>

                    {/* Map Placeholder */}
                    <Animated.View
                        style={[
                            styles.mapContainer,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: mapAnim, transform: [{ scale: mapScale }] }
                        ]}
                    >
                        <View style={[styles.mapBackground, { backgroundColor: colors.background }]}>
                            {/* Fake map lines */}
                            <View style={[styles.mapLine1, { backgroundColor: colors.border }]} />
                            <View style={[styles.mapLine2, { backgroundColor: colors.border }]} />
                            <View style={[styles.mapLine3, { backgroundColor: colors.border }]} />

                            {/* Bouncing pin with glow */}
                            <Animated.View style={[styles.pinContainer, { transform: [{ translateY: pinBounce }] }]}>
                                <Animated.View
                                    style={[
                                        styles.pinGlow,
                                        {
                                            backgroundColor: Colors.primary,
                                            opacity: pinGlow,
                                        }
                                    ]}
                                />
                                <View style={styles.pin}>
                                    <MaterialIcons name="home" size={18} color="#FFFFFF" />
                                </View>
                                <View style={styles.pinStem} />
                                <View style={styles.pinShadow} />
                            </Animated.View>
                        </View>

                        {/* Location button */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.locationButton,
                                {
                                    backgroundColor: pressed ? colors.redLighter : colors.surface,
                                    borderColor: colors.border,
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                }
                            ]}
                        >
                            <MaterialIcons name="my-location" size={20} color={Colors.primary} />
                        </Pressable>
                    </Animated.View>

                    {/* Address Input */}
                    <Animated.View
                        style={[
                            styles.inputGroup,
                            { opacity: inputAnim, transform: [{ translateY: inputSlide }] }
                        ]}
                    >
                        <Text style={[styles.label, { color: colors.text }]}>
                            Indirizzo
                        </Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <MaterialIcons name="search" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Es. Via Roma 10, Milano"
                                placeholderTextColor={colors.textMuted}
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                    </Animated.View>

                    {/* Quick Options */}
                    <Animated.View
                        style={[
                            styles.quickOptions,
                            { opacity: optionsAnim, transform: [{ translateY: optionsSlide }] }
                        ]}
                    >
                        <Pressable
                            style={({ pressed }) => [
                                styles.quickOption,
                                {
                                    backgroundColor: pressed ? colors.redLighter : 'transparent',
                                    borderRadius: 12,
                                },
                            ]}
                        >
                            <View style={[styles.quickOptionIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <MaterialIcons name="history" size={18} color={Colors.primary} />
                            </View>
                            <View style={styles.quickOptionText}>
                                <Text style={[styles.quickOptionTitle, { color: colors.text }]}>
                                    Via Garibaldi 4
                                </Text>
                                <Text style={[styles.quickOptionSubtitle, { color: colors.textMuted }]}>
                                    Milano, MI
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.quickOption,
                                {
                                    backgroundColor: pressed ? colors.redLighter : 'transparent',
                                    borderRadius: 12,
                                },
                            ]}
                        >
                            <View style={[styles.quickOptionIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <MaterialIcons name="near-me" size={18} color={Colors.primary} />
                            </View>
                            <View style={styles.quickOptionText}>
                                <Text style={[styles.quickOptionTitle, { color: colors.text }]}>
                                    Posizione attuale
                                </Text>
                                <Text style={[styles.quickOptionSubtitle, { color: colors.textMuted }]}>
                                    Utilizza il GPS
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
                        </Pressable>
                    </Animated.View>

                    {/* Security badges */}
                    <Animated.View
                        style={[
                            styles.badgesContainer,
                            { opacity: badgesAnim }
                        ]}
                    >
                        <View style={[styles.badge, { backgroundColor: colors.redLighter }]}>
                            <MaterialIcons name="security" size={14} color={Colors.primary} />
                            <Text style={[styles.badgeText, { color: Colors.primary }]}>
                                Dati crittografati
                            </Text>
                        </View>
                        <View style={styles.infoBadge}>
                            <MaterialIcons name="info-outline" size={14} color={colors.textMuted} />
                            <Text style={[styles.badgeText, { color: colors.textMuted }]}>
                                Solo per emergenze
                            </Text>
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
        paddingTop: 16,
        paddingBottom: 120,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    mapContainer: {
        height: 200,
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    mapBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapLine1: {
        position: 'absolute',
        left: '25%',
        top: 0,
        bottom: 0,
        width: 2,
        opacity: 0.3,
    },
    mapLine2: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '40%',
        height: 2,
        opacity: 0.3,
    },
    mapLine3: {
        position: 'absolute',
        left: '60%',
        top: 0,
        bottom: 0,
        width: 2,
        opacity: 0.3,
    },
    pinContainer: {
        alignItems: 'center',
    },
    pinGlow: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        top: -12,
    },
    pin: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    pinStem: {
        width: 6,
        height: 14,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },
    pinShadow: {
        width: 20,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
        marginTop: 4,
    },
    locationButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
    },
    quickOptions: {
        marginBottom: 24,
        gap: 8,
    },
    quickOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    quickOptionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        borderWidth: 1,
    },
    quickOptionText: {
        flex: 1,
    },
    quickOptionTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    quickOptionSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    badgesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
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
