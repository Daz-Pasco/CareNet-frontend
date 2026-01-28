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
    ViewToken,
    useColorScheme,
} from 'react-native';

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
    // Add more screens here as they are created
];

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

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

                <TouchableOpacity onPress={skipOnboarding}>
                    <Text style={[styles.skipText, { color: colors.textMuted }]}>
                        Salta introduzione
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    skipText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
