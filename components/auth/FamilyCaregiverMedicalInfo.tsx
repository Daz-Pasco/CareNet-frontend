import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
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
    onContinue: (data: MedicalInfoData) => void;
    onBack: () => void;
    currentStep?: number;
    totalSteps?: number;
    initialData?: MedicalInfoData;
}

export interface MedicalInfoData {
    allergies: string[];
    conditions: string[];
    medications: string[];
}

export default function FamilyCaregiverMedicalInfo({
    colorScheme,
    onContinue,
    onBack,
    currentStep = 4,
    totalSteps = 4,
    initialData,
}: Props) {
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Form state
    const [allergies, setAllergies] = useState<string[]>(initialData?.allergies || []);
    const [conditions, setConditions] = useState<string[]>(initialData?.conditions || []);
    const [medications, setMedications] = useState<string[]>(initialData?.medications || []);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'allergy' | 'condition' | 'medication'>('allergy');
    const [modalInput, setModalInput] = useState('');

    // Animation refs - Main
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;

    // Staggered section animations
    const section1Anim = useRef(new Animated.Value(0)).current;
    const section1Slide = useRef(new Animated.Value(25)).current;
    const section2Anim = useRef(new Animated.Value(0)).current;
    const section2Slide = useRef(new Animated.Value(25)).current;
    const section3Anim = useRef(new Animated.Value(0)).current;
    const section3Slide = useRef(new Animated.Value(25)).current;

    // Button animation
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

    // Modal animation
    const modalScale = useRef(new Animated.Value(0.9)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

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

        // Staggered section animations
        const staggerDelay = 120;

        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(section1Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(section1Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay),
            Animated.parallel([
                Animated.timing(section2Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(section2Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(200 + staggerDelay * 2),
            Animated.parallel([
                Animated.timing(section3Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(section3Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
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
    }, []);

    // Modal entrance animation
    useEffect(() => {
        if (modalVisible) {
            Animated.parallel([
                Animated.spring(modalScale, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true }),
                Animated.timing(modalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            modalScale.setValue(0.9);
            modalOpacity.setValue(0);
        }
    }, [modalVisible]);

    const handleContinue = () => {
        onContinue({
            allergies,
            conditions,
            medications,
        });
    };

    const openModal = (type: 'allergy' | 'condition' | 'medication') => {
        setModalType(type);
        setModalInput('');
        setModalVisible(true);
    };

    const handleAddItem = () => {
        if (modalInput.trim()) {
            switch (modalType) {
                case 'allergy':
                    setAllergies([...allergies, modalInput.trim()]);
                    break;
                case 'condition':
                    setConditions([...conditions, modalInput.trim()]);
                    break;
                case 'medication':
                    setMedications([...medications, modalInput.trim()]);
                    break;
            }
            setModalVisible(false);
            setModalInput('');
        }
    };

    const removeItem = (type: 'allergy' | 'condition' | 'medication', index: number) => {
        switch (type) {
            case 'allergy':
                setAllergies(allergies.filter((_, i) => i !== index));
                break;
            case 'condition':
                setConditions(conditions.filter((_, i) => i !== index));
                break;
            case 'medication':
                setMedications(medications.filter((_, i) => i !== index));
                break;
        }
    };

    const getModalTitle = () => {
        switch (modalType) {
            case 'allergy': return 'Aggiungi allergia';
            case 'condition': return 'Aggiungi patologia';
            case 'medication': return 'Aggiungi farmaco';
        }
    };

    const getModalPlaceholder = () => {
        switch (modalType) {
            case 'allergy': return 'Es. Polline, Penicillina...';
            case 'condition': return 'Es. Diabete, Ipertensione...';
            case 'medication': return 'Es. Metformina, Aspirina...';
        }
    };

    const getModalIcon = (): keyof typeof MaterialIcons.glyphMap => {
        switch (modalType) {
            case 'allergy': return 'spa';
            case 'condition': return 'medical-services';
            case 'medication': return 'medication';
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
                        Informazioni Mediche
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        Questi dati ci aiutano a proteggere meglio il tuo assistito.
                    </Text>

                    {/* Allergies Section */}
                    <Animated.View
                        style={[
                            styles.section,
                            { opacity: section1Anim, transform: [{ translateY: section1Slide }] }
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="spa" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Allergie</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {allergies.map((item, index) => (
                                <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                                    <View style={[styles.itemDot, { backgroundColor: Colors.primary }]} />
                                    <Text style={[styles.listItemText, { color: colors.text }]}>{item}</Text>
                                    <Pressable
                                        onPress={() => removeItem('allergy', index)}
                                        style={({ pressed }) => [
                                            styles.removeButton,
                                            { opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] }
                                        ]}
                                    >
                                        <MaterialIcons name="close" size={18} color={colors.textMuted} />
                                    </Pressable>
                                </View>
                            ))}
                            <Pressable
                                onPress={() => openModal('allergy')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    {
                                        backgroundColor: pressed ? colors.redLighter : 'transparent',
                                        borderTopColor: allergies.length > 0 ? colors.border : 'transparent',
                                        borderTopWidth: allergies.length > 0 ? 1 : 0,
                                    }
                                ]}
                            >
                                <View style={[styles.addIconCircle, { backgroundColor: colors.redLighter }]}>
                                    <MaterialIcons name="add" size={18} color={Colors.primary} />
                                </View>
                                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Aggiungi allergia</Text>
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Conditions Section */}
                    <Animated.View
                        style={[
                            styles.section,
                            { opacity: section2Anim, transform: [{ translateY: section2Slide }] }
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="medical-services" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Patologie</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {conditions.map((item, index) => (
                                <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                                    <View style={[styles.itemDot, { backgroundColor: Colors.primary }]} />
                                    <Text style={[styles.listItemText, { color: colors.text }]}>{item}</Text>
                                    <Pressable
                                        onPress={() => removeItem('condition', index)}
                                        style={({ pressed }) => [
                                            styles.removeButton,
                                            { opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] }
                                        ]}
                                    >
                                        <MaterialIcons name="close" size={18} color={colors.textMuted} />
                                    </Pressable>
                                </View>
                            ))}
                            <Pressable
                                onPress={() => openModal('condition')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    {
                                        backgroundColor: pressed ? colors.redLighter : 'transparent',
                                        borderTopColor: conditions.length > 0 ? colors.border : 'transparent',
                                        borderTopWidth: conditions.length > 0 ? 1 : 0,
                                    }
                                ]}
                            >
                                <View style={[styles.addIconCircle, { backgroundColor: colors.redLighter }]}>
                                    <MaterialIcons name="add" size={18} color={Colors.primary} />
                                </View>
                                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Aggiungi patologia</Text>
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Medications Section */}
                    <Animated.View
                        style={[
                            styles.section,
                            { opacity: section3Anim, transform: [{ translateY: section3Slide }] }
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="medication" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Farmaci</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {medications.map((item, index) => (
                                <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                                    <View style={[styles.itemDot, { backgroundColor: Colors.primary }]} />
                                    <Text style={[styles.listItemText, { color: colors.text }]}>{item}</Text>
                                    <Pressable
                                        onPress={() => removeItem('medication', index)}
                                        style={({ pressed }) => [
                                            styles.removeButton,
                                            { opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] }
                                        ]}
                                    >
                                        <MaterialIcons name="close" size={18} color={colors.textMuted} />
                                    </Pressable>
                                </View>
                            ))}
                            <Pressable
                                onPress={() => openModal('medication')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    {
                                        backgroundColor: pressed ? colors.redLighter : 'transparent',
                                        borderTopColor: medications.length > 0 ? colors.border : 'transparent',
                                        borderTopWidth: medications.length > 0 ? 1 : 0,
                                    }
                                ]}
                            >
                                <View style={[styles.addIconCircle, { backgroundColor: colors.redLighter }]}>
                                    <MaterialIcons name="add" size={18} color={Colors.primary} />
                                </View>
                                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Aggiungi farmaco</Text>
                            </Pressable>
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
                    style={({ pressed }) => [
                        styles.continueButton,
                        {
                            backgroundColor: Colors.primary,
                            opacity: pressed ? 0.9 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                    ]}
                >
                    <Text style={styles.continueButtonText}>
                        Continua
                    </Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </Pressable>
            </Animated.View>

            {/* Add Item Modal with animations */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: colors.surface,
                                transform: [{ scale: modalScale }],
                                opacity: modalOpacity,
                            }
                        ]}
                    >
                        <Pressable onPress={e => e.stopPropagation()}>
                            {/* Modal Header */}
                            <View style={styles.modalHeader}>
                                <View style={[styles.modalIcon, { backgroundColor: colors.redLighter }]}>
                                    <MaterialIcons name={getModalIcon()} size={24} color={Colors.primary} />
                                </View>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>{getModalTitle()}</Text>
                            </View>

                            <TextInput
                                style={[styles.modalInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                                placeholder={getModalPlaceholder()}
                                placeholderTextColor={colors.textMuted}
                                value={modalInput}
                                onChangeText={setModalInput}
                                autoFocus
                            />
                            <View style={styles.modalButtons}>
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                    style={({ pressed }) => [
                                        styles.modalButton,
                                        styles.modalButtonCancel,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                            transform: [{ scale: pressed ? 0.97 : 1 }],
                                        }
                                    ]}
                                >
                                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Annulla</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleAddItem}
                                    style={({ pressed }) => [
                                        styles.modalButton,
                                        {
                                            backgroundColor: modalInput.trim() ? Colors.primary : colors.border,
                                            transform: [{ scale: pressed && modalInput.trim() ? 0.97 : 1 }],
                                        }
                                    ]}
                                >
                                    <MaterialIcons name="add" size={18} color={modalInput.trim() ? '#FFFFFF' : colors.textMuted} />
                                    <Text style={[styles.modalButtonText, { color: modalInput.trim() ? '#FFFFFF' : colors.textMuted }]}>Aggiungi</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </Modal>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 28,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    itemDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    listItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    removeButton: {
        padding: 6,
        marginLeft: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
    },
    addIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
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
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    modalIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 12,
    },
    modalButtonCancel: {
        borderWidth: 1,
    },
    modalButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
