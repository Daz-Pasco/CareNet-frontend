import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
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

interface Props {
    colorScheme: 'light' | 'dark';
    onContinue: (data: PersonalInfoData) => void;
    onBack: () => void;
    currentStep?: number;
    totalSteps?: number;
    initialData?: PersonalInfoData;
}

export interface PersonalInfoData {
    dateOfBirth: string;
    patientPhone: string;
    caregiverPhone: string;
    gender: 'male' | 'female' | 'other' | null;
}

type GenderOption = {
    value: 'male' | 'female' | 'other';
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
};

const genderOptions: GenderOption[] = [
    { value: 'male', label: 'Uomo', icon: 'male' },
    { value: 'female', label: 'Donna', icon: 'female' },
];

export default function FamilyCaregiverPersonalInfo({
    colorScheme,
    onContinue,
    onBack,
    currentStep = 1,
    totalSteps = 4,
    initialData,
}: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Form state
    const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');
    const [patientPhone, setPatientPhone] = useState(initialData?.patientPhone || '');
    const [caregiverPhone, setCaregiverPhone] = useState(initialData?.caregiverPhone || '');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(initialData?.gender || null);

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

    // Auto-format date as DD/MM/YYYY
    const handleDateChange = (text: string) => {
        // Remove any non-numeric characters
        const cleaned = text.replace(/[^0-9]/g, '');

        // Format with slashes
        let formatted = '';
        if (cleaned.length > 0) {
            formatted = cleaned.substring(0, 2);
        }
        if (cleaned.length > 2) {
            formatted += '/' + cleaned.substring(2, 4);
        }
        if (cleaned.length > 4) {
            formatted += '/' + cleaned.substring(4, 8);
        }

        setDateOfBirth(formatted);
    };

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

    const handlePatientPhoneChange = (text: string) => {
        setPatientPhone(formatPhone(text));
    };

    const handleCaregiverPhoneChange = (text: string) => {
        setCaregiverPhone(formatPhone(text));
    };

    // Validate date is not in the future
    const validateDate = (dateStr: string): { isValid: boolean; error: string | null } => {
        if (dateStr.length !== 10) {
            return { isValid: false, error: null }; // Not complete yet
        }

        const parts = dateStr.split('/');
        if (parts.length !== 3) {
            return { isValid: false, error: 'Formato data non valido' };
        }

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        // Check valid ranges
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
            return { isValid: false, error: 'Data non valida' };
        }

        // Create date object (month is 0-indexed)
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if date is in the future
        if (inputDate > today) {
            return { isValid: false, error: 'La data non può essere nel futuro' };
        }

        return { isValid: true, error: null };
    };

    const dateValidation = validateDate(dateOfBirth);

    const handleContinue = () => {
        onContinue({
            dateOfBirth,
            patientPhone,
            caregiverPhone,
            gender,
        });
    };

    const patientPhoneDigits = patientPhone.replace(/\s/g, '').length;
    const caregiverPhoneDigits = caregiverPhone.replace(/\s/g, '').length;
    const phonesAreSame = patientPhone.replace(/\s/g, '') === caregiverPhone.replace(/\s/g, '') && patientPhoneDigits === 10;
    const isFormValid = dateOfBirth.length === 10 && dateValidation.isValid && patientPhoneDigits === 10 && caregiverPhoneDigits === 10 && !phonesAreSame && gender !== null;

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
                            Informazioni personali
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                            Inserisci i dati del tuo assistito per aiutarci a personalizzare la sua esperienza
                        </Text>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Date of Birth */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Data di nascita
                                </Text>
                                <View style={[styles.inputWrapper, {
                                    backgroundColor: colors.surface,
                                    borderColor: dateValidation.error ? Colors.primary : colors.border,
                                }]}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="DD/MM/YYYY"
                                        placeholderTextColor={colors.textMuted}
                                        value={dateOfBirth}
                                        onChangeText={handleDateChange}
                                        keyboardType="number-pad"
                                        maxLength={10}
                                    />
                                    <MaterialIcons
                                        name="calendar-today"
                                        size={20}
                                        color={colors.textMuted}
                                        style={styles.inputIcon}
                                    />
                                </View>
                                {dateValidation.error && (
                                    <Text style={styles.errorText}>
                                        {dateValidation.error}
                                    </Text>
                                )}
                            </View>

                            {/* Patient Phone */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Numero dell'Assistito
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
                                        value={patientPhone}
                                        onChangeText={handlePatientPhoneChange}
                                        keyboardType="number-pad"
                                        maxLength={12}
                                    />
                                </View>
                            </View>

                            {/* Caregiver Phone */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Numero dell'Assistente
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
                                        value={caregiverPhone}
                                        onChangeText={handleCaregiverPhoneChange}
                                        keyboardType="number-pad"
                                        maxLength={12}
                                    />
                                </View>
                                {phonesAreSame && (
                                    <Text style={styles.errorText}>
                                        I numeri non possono essere uguali
                                    </Text>
                                )}
                            </View>

                            {/* Gender */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Genere
                                </Text>
                                <View style={styles.genderOptions}>
                                    {genderOptions.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => setGender(option.value)}
                                            style={({ pressed }) => [
                                                styles.genderOption,
                                                {
                                                    backgroundColor: colors.surface,
                                                    borderColor: gender === option.value
                                                        ? Colors.primary
                                                        : colors.border,
                                                },
                                                gender === option.value && styles.genderOptionSelected,
                                                pressed && { opacity: 0.8 },
                                            ]}
                                        >
                                            <MaterialIcons
                                                name={option.icon}
                                                size={24}
                                                color={gender === option.value ? Colors.primary : colors.textMuted}
                                                style={styles.genderIcon}
                                            />
                                            <Text style={[
                                                styles.genderLabel,
                                                { color: gender === option.value ? Colors.primary : colors.text },
                                            ]}>
                                                {option.label}
                                            </Text>
                                            <View style={[
                                                styles.radioOuter,
                                                { borderColor: gender === option.value ? Colors.primary : colors.border },
                                                gender === option.value && { backgroundColor: Colors.primary },
                                            ]}>
                                                {gender === option.value && (
                                                    <View style={styles.radioInner} />
                                                )}
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                                <Text style={[styles.genderNote, { color: colors.textMuted }]}>
                                    Seleziona il sesso biologico per la calibrazione dei sensori medici. Questo dato serve solo a definire le soglie di allarme per la tua sicurezza.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Button */}
            <View style={styles.bottomContainer}>
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
    errorText: {
        fontSize: 12,
        color: Colors.primary,
        marginTop: 4,
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
    genderOptions: {
        gap: 12,
    },
    genderNote: {
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 12,
        lineHeight: 18,
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    genderOptionSelected: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    genderIcon: {
        marginRight: 16,
    },
    genderLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 32,
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
