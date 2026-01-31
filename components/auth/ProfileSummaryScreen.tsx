import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileData {
    fullName: string;
    personalEmail: string;
    professionalEmail: string;
    phone: string | null;
    specialization: string;
    workplace: string | null;
    avatarUrl: string | null;
}

interface Props {
    colorScheme?: 'light' | 'dark';
    profileData: ProfileData;
    onConfirm?: () => void;
    onEdit?: () => void;
    onBack?: () => void;
}

const SPECIALIZATION_LABELS: Record<string, string> = {
    medicina_generale: 'Medicina Generale',
    medicina_interna: 'Medicina Interna',
    cardiologia: 'Cardiologia',
    geriatria: 'Geriatria',
    neurologia: 'Neurologia',
    pneumologia: 'Pneumologia',
    oncologia: 'Oncologia',
    ortopedia: 'Ortopedia',
    reumatologia: 'Reumatologia',
    nefrologia: 'Nefrologia',
    endocrinologia: 'Endocrinologia',
    gastroenterologia: 'Gastroenterologia',
    dermatologia: 'Dermatologia',
    psichiatria: 'Psichiatria',
    urologia: 'Urologia',
    chirurgia_generale: 'Chirurgia Generale',
    anestesiologia: 'Anestesiologia',
    radiologia: 'Radiologia',
    medicina_urgenza: "Medicina d'Urgenza",
    medicina_palliativa: 'Medicina Palliativa',
    infermiere: 'Infermiere/a',
    infermiere_pediatrico: 'Infermiere/a Pediatrico',
    infermiere_famiglia: 'Infermiere/a di Famiglia',
    infermiere_area_critica: 'Infermiere/a di Area Critica',
    oss: 'OSS (Operatore Socio Sanitario)',
    osa: 'OSA (Operatore Socio Assistenziale)',
    assistente_familiare: 'Assistente Familiare',
    badante: 'Badante Professionale',
    fisioterapista: 'Fisioterapista',
    logopedista: 'Logopedista',
    terapista_occupazionale: 'Terapista Occupazionale',
    psicologo: 'Psicologo/a',
    educatore: 'Educatore Professionale',
    dietista: 'Dietista/Nutrizionista',
    assistente_sociale: 'Assistente Sociale',
    tecnico_radiologia: 'Tecnico Radiologia',
    tecnico_laboratorio: 'Tecnico di Laboratorio',
    farmacista: 'Farmacista',
    podologo: 'Podologo/a',
    altro: 'Altro',
};

export default function ProfileSummaryScreen({
    colorScheme = 'light',
    profileData,
    onConfirm,
    onEdit,
    onBack,
}: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Animation refs - Main
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

    // Staggered card animations
    const card1Anim = useRef(new Animated.Value(0)).current;
    const card1Slide = useRef(new Animated.Value(30)).current;
    const card2Anim = useRef(new Animated.Value(0)).current;
    const card2Slide = useRef(new Animated.Value(30)).current;
    const card3Anim = useRef(new Animated.Value(0)).current;
    const card3Slide = useRef(new Animated.Value(30)).current;

    // Button animation
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(0.9)).current;

    // Background pulse
    const pulseAnim1 = useRef(new Animated.Value(1)).current;
    const pulseAnim2 = useRef(new Animated.Value(1)).current;

    // Checkmark animation
    const checkScale = useRef(new Animated.Value(0)).current;

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
        const staggerDelay = 120;

        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(card1Anim, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.spring(card1Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay),
            Animated.parallel([
                Animated.timing(card2Anim, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.spring(card2Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay * 2),
            Animated.parallel([
                Animated.timing(card3Anim, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.spring(card3Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        // Button entrance with bounce
        Animated.sequence([
            Animated.delay(600),
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

    const getSpecializationLabel = (value: string) => {
        return SPECIALIZATION_LABELS[value] || value;
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
                {onBack && (
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [
                            styles.backButton,
                            { backgroundColor: pressed ? colors.border : 'transparent' },
                        ]}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                )}

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
                    {/* Title with checkmark */}
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Riepilogo dati
                        </Text>
                        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                            <View style={[styles.checkBadge, { backgroundColor: Colors.primary }]}>
                                <MaterialIcons name="check" size={16} color="#FFFFFF" />
                            </View>
                        </Animated.View>
                    </View>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        Controlla che tutto sia corretto prima di confermare.
                    </Text>

                    {/* Avatar Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card1Anim, transform: [{ translateY: card1Slide }] }
                        ]}
                    >
                        <View style={styles.avatarSection}>
                            <View style={[styles.avatar, { backgroundColor: colors.background }]}>
                                {profileData.avatarUrl ? (
                                    <Image source={{ uri: profileData.avatarUrl }} style={styles.avatarImage} />
                                ) : (
                                    <MaterialIcons name="person" size={48} color={colors.border} />
                                )}
                            </View>
                            <View style={styles.avatarInfo}>
                                <Text style={[styles.avatarName, { color: colors.text }]}>
                                    {profileData.fullName}
                                </Text>
                                <View style={[styles.specializationBadge, { backgroundColor: colors.redLighter }]}>
                                    <MaterialIcons name="medical-services" size={14} color={Colors.primary} />
                                    <Text style={[styles.specializationText, { color: Colors.primary }]}>
                                        {getSpecializationLabel(profileData.specialization)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Contact Info Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card2Anim, transform: [{ translateY: card2Slide }] }
                        ]}
                    >
                        <Pressable onPress={onEdit} style={styles.editButton}>
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="contact-phone" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Contatti</Text>
                        </View>
                        <View style={styles.cardGrid}>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Email Personale</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]} numberOfLines={1}>
                                    {profileData.personalEmail || '-'}
                                </Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Telefono</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>
                                    {profileData.phone ? `+39 ${profileData.phone}` : '-'}
                                </Text>
                            </View>
                            <View style={styles.gridItemFull}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Email Professionale</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]} numberOfLines={1}>
                                    {profileData.professionalEmail || '-'}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Workplace Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            { opacity: card3Anim, transform: [{ translateY: card3Slide }] }
                        ]}
                    >
                        <Pressable onPress={onEdit} style={styles.editButton}>
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="apartment" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Struttura</Text>
                        </View>
                        <View>
                            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Ospedale / Clinica</Text>
                            <Text style={[styles.gridValue, { color: colors.text }]}>
                                {profileData.workplace || 'Non specificato'}
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
                    <Text style={styles.confirmButtonText}>
                        Conferma e Inizia
                    </Text>
                    <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
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
        paddingBottom: 140,
    },
    content: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    checkBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 24,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        marginBottom: 16,
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
        padding: 4,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '500',
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
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    gridItem: {
        width: '45%',
    },
    gridItemFull: {
        width: '100%',
    },
    gridLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    gridValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarInfo: {
        flex: 1,
        gap: 8,
    },
    avatarName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    specializationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    specializationText: {
        fontSize: 13,
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
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
