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

    // Animation refs
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

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
                    {/* Title */}
                    <Text style={[styles.title, { color: colors.text }]}>
                        Riepilogo dati
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        Controlla che tutto sia corretto.
                    </Text>

                    {/* Profile Section */}
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Pressable onPress={onEditProfile} style={styles.editButton}>
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
                    </View>

                    {/* Physical Data Section */}
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Pressable onPress={onEditPhysical} style={styles.editButton}>
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="accessibility-new" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Dati Fisici</Text>
                        </View>
                        <View style={styles.cardGrid}>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Altezza</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>{data.heightCm} cm</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Peso</Text>
                                <Text style={[styles.gridValue, { color: colors.text }]}>{data.weightKg} kg</Text>
                            </View>
                        </View>
                    </View>

                    {/* Address Section */}
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Pressable onPress={onEditAddress} style={styles.editButton}>
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="home" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Indirizzo</Text>
                        </View>
                        <View>
                            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Residenza</Text>
                            <Text style={[styles.gridValue, { color: colors.text }]}>{data.address || 'Non specificato'}</Text>
                        </View>
                    </View>

                    {/* Medical Info Section */}
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Pressable onPress={onEditMedical} style={styles.editButton}>
                            <Text style={[styles.editButtonText, { color: Colors.primary }]}>Modifica</Text>
                        </Pressable>
                        <View style={styles.cardHeader}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="medical-services" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Info Mediche</Text>
                        </View>
                        <View style={styles.medicalSection}>
                            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Allergie</Text>
                            <View style={styles.tagsContainer}>
                                {data.allergies.length > 0 ? (
                                    data.allergies.map((item, index) => (
                                        <View key={index} style={[styles.tag, { backgroundColor: colors.redLighter }]}>
                                            <Text style={[styles.tagText, { color: Colors.primary }]}>{item}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={[styles.tag, { backgroundColor: colors.redLighter }]}>
                                        <Text style={[styles.tagText, { color: Colors.primary }]}>Nessuna</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.medicalSection}>
                            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Patologie</Text>
                            <View style={styles.tagsContainer}>
                                {data.conditions.length > 0 ? (
                                    data.conditions.map((item, index) => (
                                        <View key={index} style={[styles.tag, { backgroundColor: colors.border }]}>
                                            <Text style={[styles.tagText, { color: colors.text }]}>{item}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={[styles.tag, { backgroundColor: colors.border }]}>
                                        <Text style={[styles.tagText, { color: colors.text }]}>Nessuna</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.medicalSection}>
                            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>Farmaci attuali</Text>
                            {data.medications.length > 0 ? (
                                data.medications.map((item, index) => (
                                    <View key={index} style={styles.medicationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={[styles.gridValue, { color: colors.text }]}>{item}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={[styles.gridValue, { color: colors.text }]}>Nessuno</Text>
                            )}
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
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
        paddingBottom: 140,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
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
    medicalSection: {
        marginTop: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        marginVertical: 16,
    },
    medicationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 16,
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
