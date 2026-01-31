import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
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
    onConfirm: () => void;
    onBack: () => void;
    onEditProfile: () => void;
    onEditPhysical: () => void;
    onEditAddress: () => void;
    onEditMedical: () => void;
    data: SummaryData;
}

export interface SummaryData {
    // Profile
    fullName: string;
    dateOfBirth: string;
    patientPhone: string;
    caregiverPhone: string;
    gender: 'male' | 'female' | 'other' | null;
    // Physical
    heightCm: number;
    weightKg: number;
    // Address
    address: string;
    // Medical
    allergies: string[];
    conditions: string[];
    medications: string[];
}

export default function FamilyCaregiverSummary({
    colorScheme,
    onConfirm,
    onBack,
    onEditProfile,
    onEditPhysical,
    onEditAddress,
    onEditMedical,
    data,
}: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Animation refs - Main
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

    // Staggered card animations
    const card1Anim = useRef(new Animated.Value(0)).current;
    const card1Slide = useRef(new Animated.Value(25)).current;
    const card2Anim = useRef(new Animated.Value(0)).current;
    const card2Slide = useRef(new Animated.Value(25)).current;
    const card3Anim = useRef(new Animated.Value(0)).current;
    const card3Slide = useRef(new Animated.Value(25)).current;
    const card4Anim = useRef(new Animated.Value(0)).current;
    const card4Slide = useRef(new Animated.Value(25)).current;

    // Button animation
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(0.95)).current;

    // Success checkmark
    const checkScale = useRef(new Animated.Value(0)).current;

    // Background pulse
    const pulseAnim1 = useRef(new Animated.Value(1)).current;
    const pulseAnim2 = useRef(new Animated.Value(1)).current;

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

        // Staggered card animations
        const staggerDelay = 100;

        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(card1Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(card1Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay),
            Animated.parallel([
                Animated.timing(card2Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(card2Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay * 2),
            Animated.parallel([
                Animated.timing(card3Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(card3Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay * 3),
            Animated.parallel([
                Animated.timing(card4Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(card4Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        // Button entrance with bounce
        Animated.sequence([
            Animated.delay(700),
            Animated.parallel([
                Animated.timing(buttonAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(buttonScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
            ]),
        ]).start();

        // Checkmark pop animation
        Animated.sequence([
            Animated.delay(800),
            Animated.spring(checkScale, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
        ]).start();

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

    const getGenderLabel = (gender: string | null) => {
        switch (gender) {
            case 'male': return 'Uomo';
            case 'female': return 'Donna';
            default: return 'Non specificato';
        }
    };

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
                        Riepilogo
                    </Text>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressFill, { width: '100%', backgroundColor: Colors.primary }]} />
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
                    {/* Success Badge with animated checkmark */}
                    <View style={styles.successBadgeContainer}>
                        <Animated.View
                            style={[
                                styles.checkCircle,
                                {
                                    backgroundColor: colors.redLighter,
                                    transform: [{ scale: checkScale }],
                                }
                            ]}
                        >
                            <MaterialIcons name="check-circle" size={48} color={Colors.primary} />
                        </Animated.View>
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, { color: colors.text }]}>
                        Riepilogo dati
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        Controlla che tutto sia corretto prima di confermare.
                    </Text>

                    {/* Profile Section */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card1Anim, transform: [{ translateY: card1Slide }] }
                        ]}
                    >
                        <Pressable
                            onPress={onEditProfile}
                            style={({ pressed }) => [
                                styles.editButton,
                                { opacity: pressed ? 0.6 : 1 }
                            ]}
                        >
                            <MaterialIcons name="edit" size={16} color={Colors.primary} />
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="person" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Profilo</Text>
                        </View>
                        <View style={styles.cardGrid}>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Nome Completo</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>{data.fullName || 'Non specificato'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Data di Nascita</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>{data.dateOfBirth || 'Non specificata'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Tel. Assistito</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>{data.patientPhone || 'Non specificato'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Tel. Assistente</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>{data.caregiverPhone || 'Non specificato'}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Genere</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>{getGenderLabel(data.gender)}</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Physical Data Section */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card2Anim, transform: [{ translateY: card2Slide }] }
                        ]}
                    >
                        <Pressable
                            onPress={onEditPhysical}
                            style={({ pressed }) => [
                                styles.editButton,
                                { opacity: pressed ? 0.6 : 1 }
                            ]}
                        >
                            <MaterialIcons name="edit" size={16} color={Colors.primary} />
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="accessibility-new" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Dati Fisici</Text>
                        </View>
                        <View style={styles.physicalDataRow}>
                            <View style={[styles.physicalDataItem, { backgroundColor: colors.background }]}>
                                <MaterialIcons name="height" size={24} color={Colors.primary} />
                                <Text style={[styles.physicalValue, { color: colors.text }]}>{data.heightCm}</Text>
                                <Text style={[styles.physicalUnit, { color: colors.textMuted }]}>cm</Text>
                            </View>
                            <View style={[styles.physicalDataItem, { backgroundColor: colors.background }]}>
                                <MaterialIcons name="fitness-center" size={24} color={Colors.primary} />
                                <Text style={[styles.physicalValue, { color: colors.text }]}>{data.weightKg}</Text>
                                <Text style={[styles.physicalUnit, { color: colors.textMuted }]}>kg</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Address Section */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card3Anim, transform: [{ translateY: card3Slide }] }
                        ]}
                    >
                        <Pressable
                            onPress={onEditAddress}
                            style={({ pressed }) => [
                                styles.editButton,
                                { opacity: pressed ? 0.6 : 1 }
                            ]}
                        >
                            <MaterialIcons name="edit" size={16} color={Colors.primary} />
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="home" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Indirizzo</Text>
                        </View>
                        <View style={styles.addressRow}>
                            <MaterialIcons name="place" size={18} color={colors.textMuted} />
                            <Text style={[styles.addressText, { color: colors.text }]}>{data.address || 'Non specificato'}</Text>
                        </View>
                    </Animated.View>

                    {/* Medical Info Section */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card4Anim, transform: [{ translateY: card4Slide }] }
                        ]}
                    >
                        <Pressable
                            onPress={onEditMedical}
                            style={({ pressed }) => [
                                styles.editButton,
                                { opacity: pressed ? 0.6 : 1 }
                            ]}
                        >
                            <MaterialIcons name="edit" size={16} color={Colors.primary} />
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="medical-services" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Informazioni Mediche</Text>
                        </View>

                        {/* Allergies */}
                        <View style={styles.medicalSection}>
                            <View style={styles.medicalLabelRow}>
                                <MaterialIcons name="spa" size={16} color={colors.textMuted} />
                                <Text style={[styles.medicalLabel, { color: colors.textMuted }]}>Allergie</Text>
                            </View>
                            {data.allergies.length > 0 ? (
                                <View style={styles.tagsContainer}>
                                    {data.allergies.map((item, index) => (
                                        <View key={index} style={[styles.tag, { backgroundColor: colors.redLighter }]}>
                                            <Text style={[styles.tagText, { color: Colors.primary }]}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nessuna</Text>
                            )}
                        </View>

                        {/* Conditions */}
                        <View style={styles.medicalSection}>
                            <View style={styles.medicalLabelRow}>
                                <MaterialIcons name="healing" size={16} color={colors.textMuted} />
                                <Text style={[styles.medicalLabel, { color: colors.textMuted }]}>Patologie</Text>
                            </View>
                            {data.conditions.length > 0 ? (
                                <View style={styles.tagsContainer}>
                                    {data.conditions.map((item, index) => (
                                        <View key={index} style={[styles.tag, { backgroundColor: colors.redLighter }]}>
                                            <Text style={[styles.tagText, { color: Colors.primary }]}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nessuna</Text>
                            )}
                        </View>

                        {/* Medications */}
                        <View style={styles.medicalSection}>
                            <View style={styles.medicalLabelRow}>
                                <MaterialIcons name="medication" size={16} color={colors.textMuted} />
                                <Text style={[styles.medicalLabel, { color: colors.textMuted }]}>Farmaci</Text>
                            </View>
                            {data.medications.length > 0 ? (
                                <View style={styles.tagsContainer}>
                                    {data.medications.map((item, index) => (
                                        <View key={index} style={[styles.tag, { backgroundColor: colors.redLighter }]}>
                                            <Text style={[styles.tagText, { color: Colors.primary }]}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nessuno</Text>
                            )}
                        </View>
                    </Animated.View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Button */}
            <Animated.View
                style={[
                    styles.bottomContainer,
                    { paddingBottom: Math.max(insets.bottom, 24) },
                    { opacity: buttonAnim, transform: [{ scale: buttonScale }] }
                ]}
            >
                <Pressable
                    onPress={onConfirm}
                    style={({ pressed }) => [
                        styles.confirmButton,
                        {
                            backgroundColor: Colors.primary,
                            opacity: pressed ? 0.9 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <MaterialIcons name="check" size={20} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>
                        Conferma e Continua
                    </Text>
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
        paddingTop: 8,
        paddingBottom: 120,
    },
    content: {
        flex: 1,
    },
    successBadgeContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        zIndex: 10,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardGrid: {
        gap: 14,
    },
    gridItem: {
        gap: 4,
    },
    gridLabel: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    gridValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    physicalDataRow: {
        flexDirection: 'row',
        gap: 12,
    },
    physicalDataItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
    },
    physicalValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    physicalUnit: {
        fontSize: 16,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    addressText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
    },
    medicalSection: {
        marginBottom: 16,
    },
    medicalLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    medicalLabel: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 15,
        fontStyle: 'italic',
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
    confirmButton: {
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
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
