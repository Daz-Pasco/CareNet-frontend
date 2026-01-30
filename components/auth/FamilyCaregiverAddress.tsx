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

    // Animation refs
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const pinBounce = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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

        // Pin bounce animation loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(pinBounce, {
                    toValue: -10,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(pinBounce, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleContinue = () => {
        onContinue({ address });
    };

    const isFormValid = address.trim().length > 0;

    const progressWidth = `${(currentStep / totalSteps) * 100}%`;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                    <View style={[styles.mapContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={[styles.mapBackground, { backgroundColor: colors.background }]}>
                            {/* Fake map lines */}
                            <View style={styles.mapLine1} />
                            <View style={styles.mapLine2} />

                            {/* Bouncing pin */}
                            <Animated.View style={[styles.pinContainer, { transform: [{ translateY: pinBounce }] }]}>
                                <View style={styles.pin}>
                                    <MaterialIcons name="home" size={16} color="#FFFFFF" />
                                </View>
                                <View style={styles.pinStem} />
                                <View style={styles.pinShadow} />
                            </Animated.View>
                        </View>

                        {/* Location button */}
                        <Pressable style={[styles.locationButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <MaterialIcons name="my-location" size={20} color={colors.textMuted} />
                        </Pressable>
                    </View>

                    {/* Address Input */}
                    <View style={styles.inputGroup}>
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
                    </View>

                    {/* Quick Options */}
                    <View style={styles.quickOptions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.quickOption,
                                { backgroundColor: pressed ? colors.border : 'transparent' },
                            ]}
                        >
                            <View style={[styles.quickOptionIcon, { backgroundColor: colors.background }]}>
                                <MaterialIcons name="history" size={16} color={colors.textMuted} />
                            </View>
                            <View style={styles.quickOptionText}>
                                <Text style={[styles.quickOptionTitle, { color: colors.text }]}>
                                    Via Garibaldi 4
                                </Text>
                                <Text style={[styles.quickOptionSubtitle, { color: colors.textMuted }]}>
                                    Milano, MI
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.quickOption,
                                { backgroundColor: pressed ? colors.border : 'transparent' },
                            ]}
                        >
                            <View style={[styles.quickOptionIcon, { backgroundColor: colors.background }]}>
                                <MaterialIcons name="near-me" size={16} color={colors.textMuted} />
                            </View>
                            <View style={styles.quickOptionText}>
                                <Text style={[styles.quickOptionTitle, { color: colors.text }]}>
                                    Posizione attuale
                                </Text>
                                <Text style={[styles.quickOptionSubtitle, { color: colors.textMuted }]}>
                                    Utilizza il GPS
                                </Text>
                            </View>
                        </Pressable>
                    </View>

                    {/* Security badges */}
                    <View style={styles.badgesContainer}>
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
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 12,
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
        height: 180,
        borderRadius: 16,
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
        left: '30%',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: 'rgba(255,255,255,0.8)',
        transform: [{ skewX: '-10deg' }],
    },
    mapLine2: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.8)',
        transform: [{ rotate: '2deg' }],
    },
    pinContainer: {
        alignItems: 'center',
    },
    pin: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    pinStem: {
        width: 6,
        height: 12,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },
    pinShadow: {
        width: 16,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
        marginTop: 2,
    },
    locationButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    quickOptions: {
        marginBottom: 24,
    },
    quickOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    quickOptionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    quickOptionText: {
        flex: 1,
    },
    quickOptionTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    quickOptionSubtitle: {
        fontSize: 12,
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
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 16,
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
