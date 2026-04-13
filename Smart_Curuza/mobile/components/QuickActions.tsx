import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ShoppingCart, Package, Bell, Eye, Users, Settings, Smartphone, Headphones, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Screen width minus padding
const { width } = Dimensions.get('window');
const ROW_WIDTH = width - 40; // Assuming 20px padding on each side of the Dashboard container

interface QuickActionProps {
    icon: React.ElementType;
    label: string;
    onPress: () => void;
    color: string;
    bgColor: string;
}

const QuickActionItem = ({ icon: Icon, label, onPress, color, bgColor }: QuickActionProps) => (
    <TouchableOpacity 
        style={styles.actionItem} 
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }}
        activeOpacity={0.7}
    >
        <View style={styles.iconContainer}>
            <Icon size={26} color={color} />
        </View>
        <Text style={styles.actionLabel} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
);

export default function QuickActions() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    const actions = [
        { icon: Package, label: 'Inventory', color: '#fbe134', bgColor: 'rgba(251, 225, 52, 0.1)', onPress: () => router.push('/inventory') },
        { icon: Users, label: 'Contacts', color: '#8B5CF6', bgColor: '#EDE9FE', onPress: () => {} },
        { icon: Bell, label: 'Expenses', color: '#EF4444', bgColor: '#FEE2E2', onPress: () => {} },
        { icon: Smartphone, label: 'Activity', color: '#EC4899', bgColor: '#FCE7F3', onPress: () => {} },
        { icon: Eye, label: 'Catalog', color: '#06B6D4', bgColor: '#CFFAFE', onPress: () => {} },
        { icon: Settings, label: 'Settings', color: '#6B7280', bgColor: '#F3F4F6', onPress: () => {} },
        { icon: Headphones, label: 'Support', color: '#F97316', bgColor: '#FFEDD5', onPress: () => {} },
    ];

    // Chunk actions into arrays of 3
    const chunkedActions = [];
    for (let i = 0; i < actions.length; i += 3) {
        chunkedActions.push(actions.slice(i, i + 3));
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
        if (index !== activeIndex) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveIndex(index);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            {/* The Unified Rounded Row Wrapper */}
            <View style={styles.roundedRowWrapper}>
                <ScrollView 
                    horizontal 
                    pagingEnabled 
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    snapToInterval={ROW_WIDTH} // Snap to exactly the width of the row
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleScroll}
                >
                    {chunkedActions.map((chunk, pageIndex) => (
                        <View key={pageIndex} style={styles.slidePage}>
                            {chunk.map((action, actionIndex) => (
                                <View key={actionIndex} style={styles.itemWrapper}>
                                    <QuickActionItem 
                                        icon={action.icon}
                                        label={action.label}
                                        onPress={action.onPress}
                                        color={action.color}
                                        bgColor={action.bgColor}
                                    />
                                </View>
                            ))}
                            {/* Empty placeholders to keep spacing consistent on the last page if < 3 items */}
                            {chunk.length < 3 && Array.from({ length: 3 - chunk.length }).map((_, i) => (
                                <View key={`empty-${i}`} style={styles.itemWrapper} />
                            ))}
                        </View>
                    ))}
                </ScrollView>
                
                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                    {chunkedActions.map((_, index) => (
                        <View 
                            key={index} 
                            style={[
                                styles.dot, 
                                activeIndex === index && styles.dotActive
                            ]} 
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
        paddingLeft: 4,
    },
    roundedRowWrapper: {
        backgroundColor: '#2a2e34', // Executive Dark
        borderRadius: 36, // Deep pill shape
        overflow: 'hidden',
        paddingTop: 8,
        paddingBottom: 16, // Extra room for dots
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    slidePage: {
        width: ROW_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    itemWrapper: {
        width: '33.33%',
        alignItems: 'center',
    },
    actionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4, // Tighter gap to label
    },
    actionLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF', // High contrast
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        gap: 6,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Inactive Grey
    },
    dotActive: {
        width: 14,
        backgroundColor: '#fbe134', // Active Gold
    },
});
