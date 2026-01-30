import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

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

export default function ProfileSummaryScreen({ colorScheme = 'light', profileData, onConfirm, onEdit }: Props) {
    const colors = Colors[colorScheme];

    const getSpecializationLabel = (value: string) => {
        return SPECIALIZATION_LABELS[value] || value;
    };

    const DataRow = ({ label, value, icon }: { label: string; value: string | null; icon: keyof typeof MaterialIcons.glyphMap }) => (
        <View style={[styles.dataRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.dataLabel, { color: colors.textMuted }]}>{label}</Text>
            <View style={styles.dataValueContainer}>
                <MaterialIcons name={icon} size={18} color={colors.textMuted} style={styles.dataIcon} />
                <Text style={[styles.dataValue, { color: colors.text }]} numberOfLines={1}>
                    {value || '-'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background blurs */}
            <View style={styles.backgroundBlurs}>
                <View style={[styles.blurCircle, styles.topBlur, { backgroundColor: colors.redLight }]} />
                <View style={[styles.blurCircle, styles.bottomBlur, { backgroundColor: colors.redLighter }]} />
            </View>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Riepilogo Profilo</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>Verifica i tuoi dati</Text>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: colors.surface, borderColor: colors.surface }]}>
                            {profileData.avatarUrl ? (
                                <Image source={{ uri: profileData.avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <MaterialIcons name="person" size={56} color={colors.border} />
                            )}
                        </View>
                        <Pressable style={styles.editAvatarButton} onPress={onEdit}>
                            <MaterialIcons name="edit" size={14} color="#FFFFFF" />
                        </Pressable>
                    </View>
                </View>

                {/* Data Card */}
                <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <DataRow label="NOME COMPLETO" value={profileData.fullName} icon="badge" />
                    <DataRow label="EMAIL PERSONALE" value={profileData.personalEmail} icon="mail" />
                    <DataRow label="EMAIL PROFESSIONALE" value={profileData.professionalEmail} icon="work" />
                    <DataRow label="TELEFONO" value={profileData.phone} icon="call" />
                    <DataRow label="SPECIALIZZAZIONE" value={getSpecializationLabel(profileData.specialization)} icon="medical-services" />
                    <View style={styles.lastDataRow}>
                        <Text style={[styles.dataLabel, { color: colors.textMuted }]}>STRUTTURA / OSPEDALE</Text>
                        <View style={styles.dataValueContainer}>
                            <MaterialIcons name="apartment" size={18} color={colors.textMuted} style={styles.dataIcon} />
                            <Text style={[styles.dataValue, { color: colors.text }]} numberOfLines={1}>
                                {profileData.workplace || '-'}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Pressable
                    onPress={onConfirm}
                    style={({ pressed }) => [
                        styles.confirmButton,
                        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
                    ]}
                >
                    <Text style={styles.confirmButtonText}>Conferma</Text>
                </Pressable>
                <Pressable
                    onPress={onEdit}
                    style={({ pressed }) => [
                        styles.editButton,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            opacity: pressed ? 0.9 : 1,
                        },
                    ]}
                >
                    <Text style={[styles.editButtonText, { color: colors.textMuted }]}>Modifica</Text>
                </Pressable>
            </View>
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
    },
    blurCircle: {
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
        paddingTop: 32,
        paddingBottom: 16,
        zIndex: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
        zIndex: 10,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 180,
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        padding: 8,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    dataCard: {
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    dataRow: {
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
    },
    lastDataRow: {
        paddingBottom: 0,
    },
    dataLabel: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    dataValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dataIcon: {
        marginRight: 8,
    },
    dataValue: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 12,
        zIndex: 20,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    editButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    editButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
});
