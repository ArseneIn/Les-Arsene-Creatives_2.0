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
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    showMore: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#fbe134', // Brand Gold
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activityCard: {
        backgroundColor: '#2a2e34', // Brand Jet
        padding: 16,
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saleId: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
    },
    saleDetails: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
    amount: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#10B981', // Brighter green for dark mode
    },
});
