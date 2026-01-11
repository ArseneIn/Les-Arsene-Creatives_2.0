import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { History } from 'lucide-react-native';

export default function RecentActivity() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recent Activity</Text>
                <Text style={styles.showMore}>Show More</Text>
            </View>

            <View style={styles.activityCard}>
                <View style={styles.activityLeft}>
                    <View style={styles.iconBox}>
                        <History size={20} color="#6B7280" />
                    </View>
                    <View>
                        <Text style={styles.saleId}>Sale #84920</Text>
                        <Text style={styles.saleDetails}>10:45 AM • 2 items • Cash</Text>
                    </View>
                </View>
                <Text style={styles.amount}>+12,500 RWF</Text>
            </View>

            <View style={styles.activityCard}>
                <View style={styles.activityLeft}>
                    <View style={styles.iconBox}>
                        <History size={20} color="#6B7280" />
                    </View>
                    <View>
                        <Text style={styles.saleId}>Sale #84919</Text>
                        <Text style={styles.saleDetails}>09:12 AM • 1 item • Mobile</Text>
                    </View>
                </View>
                <Text style={styles.amount}>+4,200 RWF</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#9CA3AF', // gray-400
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    showMore: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fbe134', // gold
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activityCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F9FAFB', // gray-50
        marginBottom: 12,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F4F6', // gray-100
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saleId: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0b0c0c', // onyx
    },
    saleDetails: {
        fontSize: 10,
        fontWeight: '500',
        color: '#9CA3AF', // gray-400
    },
    amount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#16A34A', // green-600
    },
});
