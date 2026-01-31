import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    currentStep?: number;
    totalSteps?: number;
}

export default function ProfessionalProfileScreen({
    colorScheme = 'light',
    onComplete,
    onBack,
    currentStep = 1,
    totalSteps = 1,
}: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [phone, setPhone] = useState('');
    const [professionalEmail, setProfessionalEmail] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation refs - Header and Title
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

    // Staggered animations for form fields
    const field1Anim = useRef(new Animated.Value(0)).current;
    const field1Slide = useRef(new Animated.Value(20)).current;
    const field2Anim = useRef(new Animated.Value(0)).current;
    const field2Slide = useRef(new Animated.Value(20)).current;
    const field3Anim = useRef(new Animated.Value(0)).current;
    const field3Slide = useRef(new Animated.Value(20)).current;
    const field4Anim = useRef(new Animated.Value(0)).current;
    const field4Slide = useRef(new Animated.Value(20)).current;

    // Button animation
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

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

        // Staggered form field animations
        const staggerDelay = 100;

        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(field1Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(field1Slide, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay),
            Animated.parallel([
                Animated.timing(field2Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(field2Slide, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay * 2),
            Animated.parallel([
                Animated.timing(field3Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(field3Slide, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay * 3),
            Animated.parallel([
                Animated.timing(field4Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(field4Slide, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Button entrance
        Animated.sequence([
            Animated.delay(600),
            Animated.parallel([
                Animated.timing(buttonAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(buttonSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        // Background pulse animations
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim1, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim1, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim2, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
                    Animated.timing(pulseAnim2, { toValue: 1, duration: 2000, useNativeDriver: true }),
                ])
            ).start();
        }, 1000);
    }, []);

    // Auto-format phone as 333 123 4567
    const formatPhone = (text: string): string => {
        const cleaned = text.replace(/[^0-9]/g, '');
        let formatted = '';
        if (cleaned.length > 0) {
            formatted = cleaned.substring(0, 3);
        }
        if (cleaned.length > 3) {
            formatted += ' ' + cleaned.substring(3, 6);
        }
        if (cleaned.length > 6) {
            formatted += ' ' + cleaned.substring(6, 10);
        }
        return formatted;
    };

    const handlePhoneChange = (text: string) => {
        setPhone(formatPhone(text));
    };

    const phoneDigits = phone.replace(/\s/g, '').length;
    const isValid = phoneDigits === 10 && professionalEmail.includes('@') && specialization !== '';

    const handleSubmit = async () => {
        if (!isValid) return;
        setIsSubmitting(true);
        try {
            onComplete?.({ phone, professionalEmail, specialization, workplace });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Profilo Professionale
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
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
                            Completa il tuo profilo
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                            Inserisci i tuoi dati professionali per iniziare ad usare CareNet
                        </Text>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Telefono */}
                            <Animated.View
                                style={[
                                    styles.inputGroup,
                                    { opacity: field1Anim, transform: [{ translateY: field1Slide }] }
                                ]}
                            >
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Numero di telefono
                                </Text>
                                <View style={[styles.inputWrapper, {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                }]}>
                                    <Text style={[styles.phonePrefix, { color: colors.textMuted }]}>
                                        +39
                                    </Text>
                                    <TextInput
                                        style={[styles.phoneInput, { color: colors.text }]}
                                        placeholder="333 123 4567"
                                        placeholderTextColor={colors.textMuted}
                                        value={phone}
                                        onChangeText={handlePhoneChange}
                                        keyboardType="phone-pad"
                                        maxLength={12}
                                    />
                                </View>
                            </Animated.View>

                            {/* Email professionale */}
                            <Animated.View
                                style={[
                                    styles.inputGroup,
                                    { opacity: field2Anim, transform: [{ translateY: field2Slide }] }
                                ]}
                            >
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Email professionale
                                </Text>
                                <View style={[styles.inputWrapper, {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                }]}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="nome@ospedale.it"
                                        placeholderTextColor={colors.textMuted}
                                        value={professionalEmail}
                                        onChangeText={setProfessionalEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <MaterialIcons
                                        name="mail"
                                        size={20}
                                        color={colors.textMuted}
                                        style={styles.inputIcon}
                                    />
                                </View>
                            </Animated.View>

                            {/* Specializzazione */}
                            <Animated.View
                                style={[
                                    styles.inputGroup,
                                    { opacity: field3Anim, transform: [{ translateY: field3Slide }] }
                                ]}
                            >
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Specializzazione
                                </Text>
                                <View style={[styles.pickerWrapper, {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                }]}>
                                    <Picker
                                        selectedValue={specialization}
                                        onValueChange={setSpecialization}
                                        style={styles.picker}
                                        itemStyle={styles.pickerItem}
                                        dropdownIconColor={colors.textMuted}
                                    >
                                        <Picker.Item label="Seleziona specializzazione" value="" color="#9CA3AF" />
                                        {SPECIALIZATIONS.map((spec) => (
                                            <Picker.Item key={spec.value} label={spec.label} value={spec.value} color={colors.text} />
                                        ))}
                                    </Picker>
                                </View>
                            </Animated.View>

                            {/* Struttura */}
                            <Animated.View
                                style={[
                                    styles.inputGroup,
                                    { opacity: field4Anim, transform: [{ translateY: field4Slide }] }
                                ]}
                            >
                                <View style={styles.labelRow}>
                                    <Text style={[styles.label, { color: colors.text }]}>
                                        Struttura / Ospedale
                                    </Text>
                                    <Text style={[styles.optionalText, { color: colors.textMuted }]}>
                                        Opzionale
                                    </Text>
                                </View>
                                <View style={[styles.inputWrapper, {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                }]}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="Nome della struttura"
                                        placeholderTextColor={colors.textMuted}
                                        value={workplace}
                                        onChangeText={setWorkplace}
                                    />
                                    <MaterialIcons
                                        name="apartment"
                                        size={20}
                                        color={colors.textMuted}
                                        style={styles.inputIcon}
                                    />
                                </View>
                            </Animated.View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Button */}
            <Animated.View
                style={[
                    styles.bottomContainer,
                    { opacity: buttonAnim, transform: [{ translateY: buttonSlide }] }
                ]}
            >
                <Pressable
                    onPress={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    style={({ pressed }) => [
                        styles.continueButton,
                        {
                            backgroundColor: isValid ? Colors.primary : colors.border,
                            opacity: pressed && isValid ? 0.9 : 1,
                            transform: [{ scale: pressed && isValid ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <Text style={[
                        styles.continueButtonText,
                        { color: isValid ? '#FFFFFF' : colors.textMuted },
                    ]}>
                        Completa Registrazione
                    </Text>
                    <MaterialIcons
                        name="check-circle"
                        size={20}
                        color={isValid ? '#FFFFFF' : colors.textMuted}
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
        marginLeft: -8,
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
    keyboardView: {
        flex: 1,
        zIndex: 10,
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 32,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    optionalText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    inputIcon: {
        marginLeft: 8,
    },
    phonePrefix: {
        fontSize: 16,
        marginRight: 8,
    },
    phoneInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        height: 180,
    },
    pickerItem: {
        fontSize: 16,
        height: 180,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 32,
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
