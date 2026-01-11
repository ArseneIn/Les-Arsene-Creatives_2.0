import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { CreditCard, Package, Users, FileText, TrendingUp } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

interface DashboardStatsData {
    todaySales: number;
    todayProfit: number;
    todayTransactionCount: number;
    todayVat: number;
    lowStockCount: number;
    totalDebt: number;
    yieldRate: number;
}

export default function DashboardStats() {
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await ApiClient.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <View style={[styles.mainCard, { alignItems: 'center', justifyContent: 'center', height: 200 }]}>
                <ActivityIndicator color="#fbe134" size="large" />
            </View>
        );
    }

    const data = stats || {
        todaySales: 0,
        todayProfit: 0,
        todayTransactionCount: 0,
        todayVat: 0,
        lowStockCount: 0,
        totalDebt: 0,
        yieldRate: 0,
    };

    return (
        <View>
            {/* Hero Card - Today's Sales */}
            <View style={styles.mainCard}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardLabel}>Today's Sales</Text>
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountText}>{data.todaySales.toLocaleString()}</Text>
                            <Text style={styles.currencyText}>RWF</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainerGold}>
                        <CreditCard size={24} color="#fbe134" />
                    </View>
                </View>
                <View style={styles.trendBadge}>
                    <TrendingUp size={14} color="#16A34A" style={{ marginRight: 4 }} />
                    <Text style={styles.trendText}>{data.todayTransactionCount} Transactions</Text>
                </View>
            </View>

            {/* Secondary KPIs - Horizontal Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                style={styles.scrollView}
            >
                {/* VAT Payable */}
                <View style={[styles.secondaryCard, styles.borderBlue]}>
                    <View style={[styles.miniIcon, styles.bgBlue]}>
                        <FileText size={20} color="#3B82F6" />
                    </View>
                    <Text style={styles.secondaryLabel}>VAT Payable</Text>
                    <Text style={styles.secondaryValue}>{data.todayVat.toLocaleString()}</Text>
                    <Text style={styles.subTextGray}>RWF</Text>
                </View>

                {/* Low Stock */}
                <View style={[styles.secondaryCard, data.lowStockCount > 0 ? styles.borderRed : styles.borderGreen]}>
                    <View style={[styles.miniIcon, data.lowStockCount > 0 ? styles.bgRed : styles.bgGreen]}>
                        <Package size={20} color={data.lowStockCount > 0 ? "#EF4444" : "#10B981"} />
                    </View>
                    <Text style={styles.secondaryLabel}>Low Stock</Text>
                    <Text style={styles.secondaryValue}>{data.lowStockCount}</Text>
                    <Text style={data.lowStockCount > 0 ? styles.subTextRed : styles.subTextGreen}>
                        {data.lowStockCount > 0 ? 'Critical Items' : 'Stock Healthy'}
                    </Text>
                </View>

                {/* Debt */}
                <View style={[styles.secondaryCard, styles.borderRed]}>
                    <View style={[styles.miniIcon, styles.bgRed]}>
                        <Users size={20} color="#EF4444" />
                    </View>
                    <Text style={styles.secondaryLabel}>Debt</Text>
                    <Text style={[styles.secondaryValue, styles.textRed]}>{data.totalDebt.toLocaleString()}</Text>
                    <Text style={styles.subTextRed}>Outstanding</Text>
                </View>

                {/* Profit */}
                <View style={[styles.secondaryCard, data.todayProfit >= 0 ? styles.borderGreen : styles.borderRed]}>
                    <View style={[styles.miniIcon, data.todayProfit >= 0 ? styles.bgGreen : styles.bgRed]}>
                        <TrendingUp size={20} color={data.todayProfit >= 0 ? "#10B981" : "#EF4444"} />
                    </View>
                    <Text style={styles.secondaryLabel}>Profit</Text>
                    <Text style={[styles.secondaryValue, data.todayProfit >= 0 ? styles.textGreen : styles.textRed]}>
                        {data.todayProfit.toLocaleString()}
                    </Text>
                    <Text style={styles.subTextGray}>{data.yieldRate.toFixed(1)}% Margin</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 32,
        borderTopWidth: 4,
        borderTopColor: '#fbe134', // gold
        shadowColor: '#E5E7EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF', // gray-400
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 4,
    },
    amountText: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c', // onyx
    },
    currencyText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#9CA3AF', // gray-400
        marginLeft: 4,
    },
    iconContainerGold: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(251, 225, 52, 0.1)', // gold/10
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F0FDF4', // green-50
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    trendText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#16A34A', // green-600
    },
    scrollView: {
        marginHorizontal: -20, // Negative margin to allow full-width scrolling
        marginBottom: 20,
    },
    scrollContainer: {
        paddingHorizontal: 20, // Padding to start content aligned with main card
        gap: 12,
        paddingBottom: 10, // Space for shadow
    },
    secondaryCard: {
        width: 150, // Fixed width for carousel items
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 28,
        borderTopWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    borderBlue: { borderTopColor: '#3B82F6' },
    borderRed: { borderTopColor: '#EF4444' },
    borderGreen: { borderTopColor: '#10B981' },

    miniIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    bgBlue: { backgroundColor: '#EFF6FF' },
    bgRed: { backgroundColor: '#FEF2F2' },
    bgGreen: { backgroundColor: '#ECFDF5' },

    secondaryLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF', // gray-400
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    secondaryValue: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        marginTop: 4,
        color: '#0b0c0c', // onyx
    },
    textRed: { color: '#EF4444' },
    textGreen: { color: '#10B981' },

    subTextRed: { fontSize: 10, color: '#F87171', marginTop: 4 },
    subTextGreen: { fontSize: 10, color: '#34D399', marginTop: 4 },
    subTextGray: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
});
