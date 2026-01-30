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
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="spa" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Allergie</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {allergies.map((item, index) => (
                                <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                                    <Text style={[styles.listItemText, { color: colors.text }]}>{item}</Text>
                                    <Pressable onPress={() => removeItem('allergy', index)} style={styles.removeButton}>
                                        <MaterialIcons name="remove-circle-outline" size={20} color={colors.textMuted} />
                                    </Pressable>
                                </View>
                            ))}
                            <Pressable
                                onPress={() => openModal('allergy')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    { backgroundColor: pressed ? colors.redLighter : 'transparent', borderTopColor: colors.border }
                                ]}
                            >
                                <MaterialIcons name="add" size={20} color={Colors.primary} />
                                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Aggiungi allergia</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Conditions Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="medical-services" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Patologie</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {conditions.map((item, index) => (
                                <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                                    <Text style={[styles.listItemText, { color: colors.text }]}>{item}</Text>
                                    <Pressable onPress={() => removeItem('condition', index)} style={styles.removeButton}>
                                        <MaterialIcons name="remove-circle-outline" size={20} color={colors.textMuted} />
                                    </Pressable>
                                </View>
                            ))}
                            <Pressable
                                onPress={() => openModal('condition')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    { backgroundColor: pressed ? colors.redLighter : 'transparent', borderTopColor: colors.border }
                                ]}
                            >
                                <MaterialIcons name="add" size={20} color={Colors.primary} />
                                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Aggiungi patologia</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Medications Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: colors.redLighter }]}>
                                <MaterialIcons name="medication" size={20} color={Colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Farmaci</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {medications.map((item, index) => (
                                <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                                    <Text style={[styles.listItemText, { color: colors.text }]}>{item}</Text>
                                    <Pressable onPress={() => removeItem('medication', index)} style={styles.removeButton}>
                                        <MaterialIcons name="remove-circle-outline" size={20} color={colors.textMuted} />
                                    </Pressable>
                                </View>
                            ))}
                            <Pressable
                                onPress={() => openModal('medication')}
                                style={({ pressed }) => [
                                    styles.addButton,
                                    { backgroundColor: pressed ? colors.redLighter : 'transparent', borderTopColor: colors.border }
                                ]}
                            >
                                <MaterialIcons name="add" size={20} color={Colors.primary} />
                                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Aggiungi farmaco</Text>
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
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
            </View>

            {/* Add Item Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={[styles.modalContent, { backgroundColor: colors.surface }]} onPress={e => e.stopPropagation()}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{getModalTitle()}</Text>
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
                                style={[styles.modalButton, { backgroundColor: colors.border }]}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.text }]}>Annulla</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleAddItem}
                                style={[styles.modalButton, { backgroundColor: Colors.primary }]}
                            >
                                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Aggiungi</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
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
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 32,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    listItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    removeButton: {
        padding: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderTopWidth: 1,
    },
    addButtonText: {
        fontSize: 14,
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
        borderRadius: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
