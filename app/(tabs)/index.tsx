import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const MONTHS = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

export default function HomePage() {
    const colors = Colors.light;
    const insets = useSafeAreaInsets();
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.getDate());

    // Get days in current month
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Generate calendar grid
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View>
                    <Text style={[styles.greeting, { color: colors.textMuted }]}>
                        Buongiorno 👋
                    </Text>
                    <Text style={[styles.title, { color: colors.text }]}>
                        La tua agenda
                    </Text>
                </View>
                <Pressable style={[styles.profileButton, { backgroundColor: colors.surface }]}>
                    <MaterialIcons name="person" size={24} color={colors.text} />
                </Pressable>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Calendar Card */}
                <View style={[styles.calendarCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {/* Month Header */}
                    <View style={styles.monthHeader}>
                        <Pressable style={styles.monthNav}>
                            <MaterialIcons name="chevron-left" size={24} color={colors.textMuted} />
                        </Pressable>
                        <Text style={[styles.monthText, { color: colors.text }]}>
                            {MONTHS[today.getMonth()]} {today.getFullYear()}
                        </Text>
                        <Pressable style={styles.monthNav}>
                            <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
                        </Pressable>
                    </View>

                    {/* Day Headers */}
                    <View style={styles.dayHeaders}>
                        {DAYS.map((day) => (
                            <Text key={day} style={[styles.dayHeader, { color: colors.textMuted }]}>
                                {day}
                            </Text>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    <View style={styles.calendarGrid}>
                        {calendarDays.map((day, index) => (
                            <Pressable
                                key={index}
                                onPress={() => day && setSelectedDate(day)}
                                style={[
                                    styles.dayCell,
                                    day === selectedDate && styles.selectedDay,
                                    day === selectedDate && { backgroundColor: Colors.primary },
                                    day === today.getDate() && day !== selectedDate && {
                                        borderColor: Colors.primary,
                                        borderWidth: 2,
                                    },
                                ]}
                            >
                                {day && (
                                    <Text style={[
                                        styles.dayText,
                                        { color: day === selectedDate ? '#FFFFFF' : colors.text },
                                    ]}>
                                        {day}
                                    </Text>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Empty State for Events */}
                <View style={[styles.eventsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.emptyIcon, { backgroundColor: colors.redLighter }]}>
                        <MaterialIcons name="event" size={32} color={Colors.primary} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        Nessun evento
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                        Non ci sono appuntamenti per il {selectedDate} {MONTHS[today.getMonth()]}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    calendarCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthNav: {
        padding: 4,
    },
    monthText: {
        fontSize: 18,
        fontWeight: '600',
    },
    dayHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    dayHeader: {
        width: 40,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    selectedDay: {
        borderRadius: 20,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
    },
    eventsCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
});
