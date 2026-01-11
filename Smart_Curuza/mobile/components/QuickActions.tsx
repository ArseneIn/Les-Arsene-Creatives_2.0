import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart, Package, Bell, Eye, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function QuickActions() {
    const router = useRouter();

    return (
        <View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.grid}>
                {/* Record Sale */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push('/sales')}
                    activeOpacity={0.7}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, styles.bgAmber]}>
                            <ShoppingCart size={24} color="#F59E0B" />
                        </View>
                        <View style={styles.arrowContainer}>
                            <ArrowRight size={16} color="#D1D5DB" />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Record Sale</Text>
                        <Text style={styles.cardSubtitle}>New checkout</Text>
                    </View>
                </TouchableOpacity>

                {/* Add Stock */}
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={() => router.push('/inventory')}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, styles.bgBlue]}>
                            <Package size={24} color="#3B82F6" />
                        </View>
                        <View style={styles.arrowContainer}>
                            <ArrowRight size={16} color="#D1D5DB" />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Add Stock</Text>
                        <Text style={styles.cardSubtitle}>Update inventory</Text>
                    </View>
                </TouchableOpacity>

                {/* Send Reminder */}
                <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, styles.bgPurple]}>
                            <Bell size={24} color="#A855F7" />
                        </View>
                        <View style={styles.arrowContainer}>
                            <ArrowRight size={16} color="#D1D5DB" />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Send Reminder</Text>
                        <Text style={styles.cardSubtitle}>Manage loyalty</Text>
                    </View>
                </TouchableOpacity>

                {/* View Reports */}
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={() => router.push('/reports')}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, styles.bgEmerald]}>
                            <Eye size={24} color="#10B981" />
                        </View>
                        <View style={styles.arrowContainer}>
                            <ArrowRight size={16} color="#D1D5DB" />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>View Reports</Text>
                        <Text style={styles.cardSubtitle}>Sales analytics</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF', // gray-400
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 16,
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 24,
        justifyContent: 'space-between',
        height: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowContainer: {
        padding: 4,
    },
    bgAmber: { backgroundColor: '#FFFBEB' },
    bgBlue: { backgroundColor: '#EFF6FF' },
    bgPurple: { backgroundColor: '#FAF5FF' },
    bgEmerald: { backgroundColor: '#ECFDF5' },

    textContainer: {
        marginTop: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c', // onyx
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 11,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF', // gray-400
    },
});
