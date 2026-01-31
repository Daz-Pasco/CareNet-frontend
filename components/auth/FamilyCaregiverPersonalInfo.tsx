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

    // Focus states for visual feedback
    const [dateOfBirthFocused, setDateOfBirthFocused] = useState(false);
    const [patientPhoneFocused, setPatientPhoneFocused] = useState(false);
    const [caregiverPhoneFocused, setCaregiverPhoneFocused] = useState(false);

    // Animation refs - Main
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const iconScale = useRef(new Animated.Value(0.8)).current;

    // Staggered field animations
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

    // Icon glow
    const iconGlow = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Main fade in with icon spring
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

        // Staggered field animations
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
                Animated.timing(buttonAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(buttonSlide, { toValue: 0, friction: 6, tension: 60, useNativeDriver: true }),
            ]),
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

        // Icon glow pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconGlow, { toValue: 1.15, duration: 1500, useNativeDriver: true }),
                Animated.timing(iconGlow, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
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
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
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
                        {/* Icon with glow pulse */}
                        <View style={styles.iconContainer}>
                            <Animated.View
                                style={[
                                    styles.iconGlow,
                                    {
                                        backgroundColor: colors.redLighter,
                                        transform: [{ scale: iconGlow }],
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
                                <MaterialIcons name="person-outline" size={56} color={Colors.primary} />
                            </Animated.View>
                        </View>

                        {/* Title */}
                        <View style={styles.titleContainer}>
                            <Text style={[styles.title, { color: colors.text }]}>
                                Dati dell'Assistito
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                                Inserisci i dati personali della persona che stai assistendo.
                            </Text>
                        </View>

                        {/* Date of Birth Field */}
                        <Animated.View
                            style={[
                                styles.inputGroup,
                                { opacity: field1Anim, transform: [{ translateY: field1Slide }] }
                            ]}
                        >
                            <Text style={[styles.label, { color: colors.text }]}>
                                Data di Nascita
                            </Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: dateOfBirthFocused ? Colors.primary : colors.border,
                                        borderWidth: dateOfBirthFocused ? 2 : 1,
                                    }
                                ]}
                            >
                                <MaterialIcons name="cake" size={20} color={dateOfBirthFocused ? Colors.primary : colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="GG/MM/AAAA"
                                    placeholderTextColor={colors.textMuted}
                                    value={dateOfBirth}
                                    onChangeText={handleDateChange}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    onFocus={() => setDateOfBirthFocused(true)}
                                    onBlur={() => setDateOfBirthFocused(false)}
                                />
                            </View>
                            {dateValidation.error && (
                                <View style={styles.errorContainer}>
                                    <MaterialIcons name="error-outline" size={14} color={Colors.primary} />
                                    <Text style={[styles.errorText, { color: Colors.primary }]}>{dateValidation.error}</Text>
                                </View>
                            )}
                        </Animated.View>

                        {/* Patient Phone Field */}
                        <Animated.View
                            style={[
                                styles.inputGroup,
                                { opacity: field2Anim, transform: [{ translateY: field2Slide }] }
                            ]}
                        >
                            <Text style={[styles.label, { color: colors.text }]}>
                                Telefono Assistito
                            </Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: patientPhoneFocused ? Colors.primary : colors.border,
                                        borderWidth: patientPhoneFocused ? 2 : 1,
                                    }
                                ]}
                            >
                                <MaterialIcons name="phone" size={20} color={patientPhoneFocused ? Colors.primary : colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="333 123 4567"
                                    placeholderTextColor={colors.textMuted}
                                    value={patientPhone}
                                    onChangeText={handlePatientPhoneChange}
                                    keyboardType="phone-pad"
                                    maxLength={12}
                                    onFocus={() => setPatientPhoneFocused(true)}
                                    onBlur={() => setPatientPhoneFocused(false)}
                                />
                            </View>
                        </Animated.View>

                        {/* Caregiver Phone Field */}
                        <Animated.View
                            style={[
                                styles.inputGroup,
                                { opacity: field3Anim, transform: [{ translateY: field3Slide }] }
                            ]}
                        >
                            <Text style={[styles.label, { color: colors.text }]}>
                                Il tuo Telefono
                            </Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: caregiverPhoneFocused ? Colors.primary : (phonesAreSame ? '#f97316' : colors.border),
                                        borderWidth: caregiverPhoneFocused || phonesAreSame ? 2 : 1,
                                    }
                                ]}
                            >
                                <MaterialIcons name="phone-android" size={20} color={caregiverPhoneFocused ? Colors.primary : colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="333 123 4567"
                                    placeholderTextColor={colors.textMuted}
                                    value={caregiverPhone}
                                    onChangeText={handleCaregiverPhoneChange}
                                    keyboardType="phone-pad"
                                    maxLength={12}
                                    onFocus={() => setCaregiverPhoneFocused(true)}
                                    onBlur={() => setCaregiverPhoneFocused(false)}
                                />
                            </View>
                            {phonesAreSame && (
                                <View style={styles.errorContainer}>
                                    <MaterialIcons name="warning" size={14} color="#f97316" />
                                    <Text style={[styles.errorText, { color: '#f97316' }]}>I numeri devono essere diversi</Text>
                                </View>
                            )}
                        </Animated.View>

                        {/* Gender Selection */}
                        <Animated.View
                            style={[
                                styles.inputGroup,
                                { opacity: field4Anim, transform: [{ translateY: field4Slide }] }
                            ]}
                        >
                            <Text style={[styles.label, { color: colors.text }]}>
                                Genere
                            </Text>
                            <View style={styles.genderButtons}>
                                {genderOptions.map((option) => (
                                    <Pressable
                                        key={option.value}
                                        onPress={() => setGender(option.value)}
                                        style={({ pressed }) => [
                                            styles.genderButton,
                                            {
                                                backgroundColor: gender === option.value ? colors.redLighter : colors.surface,
                                                borderColor: gender === option.value ? Colors.primary : colors.border,
                                                borderWidth: gender === option.value ? 2 : 1,
                                                transform: [{ scale: pressed ? 0.97 : 1 }],
                                            },
                                        ]}
                                    >
                                        <View style={[
                                            styles.genderIconCircle,
                                            { backgroundColor: gender === option.value ? Colors.primary : colors.background }
                                        ]}>
                                            <MaterialIcons
                                                name={option.icon}
                                                size={20}
                                                color={gender === option.value ? '#FFFFFF' : colors.textMuted}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.genderLabel,
                                            { color: gender === option.value ? Colors.primary : colors.text }
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </Animated.View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

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
    keyboardAvoid: {
        flex: 1,
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
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
        marginTop: 16,
        marginBottom: 20,
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
        width: 110,
        height: 110,
        borderRadius: 55,
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
        marginBottom: 28,
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
    inputGroup: {
        width: '100%',
        marginBottom: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
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
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    errorText: {
        fontSize: 13,
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 10,
    },
    genderIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    genderLabel: {
        fontSize: 15,
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
