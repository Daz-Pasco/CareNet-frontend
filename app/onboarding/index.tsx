import OnboardingScreen1 from '@/components/onboarding/OnboardingScreen1';
import OnboardingScreen2 from '@/components/onboarding/OnboardingScreen2';
import OnboardingScreen3 from '@/components/onboarding/OnboardingScreen3';
import OnboardingScreen4 from '@/components/onboarding/OnboardingScreen4';
import OnboardingScreen5 from '@/components/onboarding/OnboardingScreen5';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    component: React.ComponentType<{ colorScheme: 'light' | 'dark' }>;
}

const slides: OnboardingSlide[] = [
    { id: '1', component: OnboardingScreen1 },
    { id: '2', component: OnboardingScreen2 },
    { id: '3', component: OnboardingScreen3 },
    { id: '4', component: OnboardingScreen4 },
    { id: '5', component: OnboardingScreen5 },
];

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colorScheme = 'light'; // Force light mode for onboarding
    const colors = Colors.light;

    const viewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                setCurrentIndex(viewableItems[0].index);
            }
        }
    ).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            // Navigate to main app
            router.replace('/(tabs)');
        }
    };

    const skipOnboarding = () => {
        router.replace('/(tabs)');
    };

    const renderItem = ({ item }: { item: OnboardingSlide }) => {
        const SlideComponent = item.component;
        return (
            <View style={[styles.slide, { width }]}>
                <SlideComponent colorScheme={colorScheme} />
            </View>
        );
    };

    const renderPagination = () => (
        <View style={styles.pagination}>
            {slides.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            backgroundColor:
                                index === currentIndex ? Colors.primary : colors.border,
                            width: index === currentIndex ? 32 : 8,
                        },
                    ]}
                />
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header with Skip button */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.headerSpacer} />
                <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
                    <Text style={[styles.skipText, { color: colors.textMuted }]}>
                        Salta
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                style={styles.flatList}
            />

            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                {renderPagination()}

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={scrollToNext}
                    activeOpacity={0.9}
                >
                    <Text style={styles.nextButtonText}>Avanti</Text>
                    <Text style={styles.nextButtonIcon}>→</Text>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    headerSpacer: {
        flex: 1,
    },
    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '500',
    },
    flatList: {
        flex: 1,
    },
    slide: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 16,
        alignItems: 'center',
        gap: 24,
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        width: '100%',
        backgroundColor: Colors.primary,
        paddingVertical: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    nextButtonIcon: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
