import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const SPECIALIZATIONS = [
    // Medici
    { label: 'Medicina Generale', value: 'medicina_generale' },
    { label: 'Medicina Interna', value: 'medicina_interna' },
    { label: 'Cardiologia', value: 'cardiologia' },
    { label: 'Geriatria', value: 'geriatria' },
    { label: 'Neurologia', value: 'neurologia' },
    { label: 'Pneumologia', value: 'pneumologia' },
    { label: 'Oncologia', value: 'oncologia' },
    { label: 'Ortopedia', value: 'ortopedia' },
    { label: 'Reumatologia', value: 'reumatologia' },
    { label: 'Nefrologia', value: 'nefrologia' },
    { label: 'Endocrinologia', value: 'endocrinologia' },
    { label: 'Gastroenterologia', value: 'gastroenterologia' },
    { label: 'Dermatologia', value: 'dermatologia' },
    { label: 'Psichiatria', value: 'psichiatria' },
    { label: 'Urologia', value: 'urologia' },
    { label: 'Chirurgia Generale', value: 'chirurgia_generale' },
    { label: 'Anestesiologia', value: 'anestesiologia' },
    { label: 'Radiologia', value: 'radiologia' },
    { label: 'Medicina d\'Urgenza', value: 'medicina_urgenza' },
    { label: 'Medicina Palliativa', value: 'medicina_palliativa' },
    // Infermieri
    { label: 'Infermiere/a', value: 'infermiere' },
    { label: 'Infermiere/a Pediatrico', value: 'infermiere_pediatrico' },
    { label: 'Infermiere/a di Famiglia', value: 'infermiere_famiglia' },
    { label: 'Infermiere/a di Area Critica', value: 'infermiere_area_critica' },
    // OSS e figure assistenziali
    { label: 'OSS (Operatore Socio Sanitario)', value: 'oss' },
    { label: 'OSA (Operatore Socio Assistenziale)', value: 'osa' },
    { label: 'Assistente Familiare', value: 'assistente_familiare' },
    { label: 'Badante Professionale', value: 'badante' },
    // Riabilitazione
    { label: 'Fisioterapista', value: 'fisioterapista' },
    { label: 'Logopedista', value: 'logopedista' },
    { label: 'Terapista Occupazionale', value: 'terapista_occupazionale' },
    { label: 'Psicologo/a', value: 'psicologo' },
    { label: 'Educatore Professionale', value: 'educatore' },
    // Altre figure
    { label: 'Dietista/Nutrizionista', value: 'dietista' },
    { label: 'Assistente Sociale', value: 'assistente_sociale' },
    { label: 'Tecnico Radiologia', value: 'tecnico_radiologia' },
    { label: 'Tecnico di Laboratorio', value: 'tecnico_laboratorio' },
    { label: 'Farmacista', value: 'farmacista' },
    { label: 'Podologa/o', value: 'podologo' },
    { label: 'Altro', value: 'altro' },
];

interface Props {
    colorScheme?: 'light' | 'dark';
    onComplete?: (data: { phone: string; professionalEmail: string; specialization: string; workplace: string }) => void;
    onBack?: () => void;
}

export default function ProfessionalProfileScreen({ colorScheme = 'light', onComplete, onBack }: Props) {
    const colors = Colors[colorScheme];
    const [phone, setPhone] = useState('');
    const [professionalEmail, setProfessionalEmail] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValid = phone.length >= 10 && professionalEmail.includes('@') && specialization !== '';

    const handleSubmit = async () => {
        if (!isValid) return;
        setIsSubmitting(true);
        try {
            onComplete?.({ phone, professionalEmail, specialization, workplace });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background blur */}
            <View style={styles.backgroundBlur}>
                <View style={[styles.blurCircle, { backgroundColor: colors.redLight }]} />
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Passo finale</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                    Completa il tuo profilo professionale
                </Text>
            </View>

            {/* Form */}
            <ScrollView
                style={styles.formContainer}
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Telefono */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Numero di telefono</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MaterialIcons name="call" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="+39 333 123 4567"
                            placeholderTextColor={colors.textMuted}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Email professionale */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Email professionale</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MaterialIcons name="mail" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Inserisci email"
                            placeholderTextColor={colors.textMuted}
                            value={professionalEmail}
                            onChangeText={setProfessionalEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Specializzazione */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Specializzazione</Text>
                    <View style={[styles.inputWrapper, styles.pickerWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MaterialIcons name="medical-services" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <Picker
                            selectedValue={specialization}
                            onValueChange={setSpecialization}
                            style={[styles.picker, { color: colors.text }]}
                            dropdownIconColor={colors.textMuted}
                        >
                            <Picker.Item label="Seleziona specializzazione" value="" color={colors.textMuted} />
                            {SPECIALIZATIONS.map((spec) => (
                                <Picker.Item key={spec.value} label={spec.label} value={spec.value} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Struttura */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Struttura / Ospedale</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MaterialIcons name="apartment" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Inserisci struttura"
                            placeholderTextColor={colors.textMuted}
                            value={workplace}
                            onChangeText={setWorkplace}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <Pressable
                    onPress={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    style={({ pressed }) => [
                        styles.submitButton,
                        {
                            backgroundColor: isValid ? Colors.primary : '#9CA3AF',
                            opacity: pressed ? 0.9 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <Text style={styles.submitButtonText}>Completa Registrazione</Text>
                    <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    blurCircle: {
        position: 'absolute',
        top: '-5%',
        right: '-10%',
        width: 256,
        height: 256,
        borderRadius: 999,
        opacity: 0.5,
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 24,
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
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        zIndex: 10,
    },
    formContent: {
        paddingTop: 16,
        paddingBottom: 24,
        justifyContent: 'center',
        flexGrow: 1,
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
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    pickerWrapper: {
        paddingHorizontal: 0,
        paddingLeft: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 14,
    },
    picker: {
        flex: 1,
        marginLeft: -8,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 16,
        zIndex: 20,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
