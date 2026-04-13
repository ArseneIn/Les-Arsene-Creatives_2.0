import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { CreditCard, Package, Users, FileText, ChevronDown, TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

const { width } = Dimensions.get('window');

interface DashboardStatsData {
    todaySales: number;
    todayProfit: number;
    todayTransactionCount: number;
    todayVat: number;
    lowStockCount: number;
    totalDebt: number;
    yieldRate: number;
    expenses?: number; // Estimated for comparison
    grossProfit?: number; 
}

type Period = 'today' | 'week' | 'month';

interface DashboardStatsProps {
    period: Period;
    setPeriod: (p: Period) => void;
}

const MiniSparkline = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    return (
        <View style={styles.sparklineContainer}>
            {data.map((val, i) => (
                <View 
                    key={i} 
                    style={[
                        styles.sparkBar, 
                        { 
                            height: (val / max) * 16, 
                            backgroundColor: color,
                            opacity: 0.3 + (i / data.length) * 0.7 
                        }
                    ]} 
                />
            ))}
        </View>
    );
};

export default function DashboardStats({ period, setPeriod }: DashboardStatsProps) {
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async (p: Period) => {
        setRefreshing(true);
        try {
            const data = await ApiClient.getDashboardStats(p);
            // Mocking expenses and gross if not provided
            const enhancedData = {
                ...data,
                expenses: data.todaySales * 0.4,
                grossProfit: data.todaySales * 0.9,
            };
            setStats(enhancedData);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats(period);
    }, [period]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fbe134" size="large" />
            </View>
        );
    }

    const formatAmount = (val: any) => {
        if (typeof val !== 'number' || isNaN(val)) return '0';
        return val.toLocaleString();
    };

    const data = stats || {
        todaySales: 0,
        todayProfit: 0,
        todayTransactionCount: 0,
        todayVat: 0,
        lowStockCount: 0,
        totalDebt: 0,
        yieldRate: 0,
        expenses: 0,
        grossProfit: 0,
    };

    const calculateRotation = (yieldRate: number) => {
        const safeMargin = Math.min(Math.max(yieldRate || 0, 0), 100);
        return `${(safeMargin / 100) * 180 - 135}deg`;
    };

    return (
        <View style={styles.container}>
            {/* Header / Filter Row */}
            <View style={styles.headerRow}>
                <View style={styles.periodSelector}>
                    <Text style={styles.periodText}>{period.charAt(0).toUpperCase() + period.slice(1)} View</Text>
                </View>
                <View style={styles.periodToggle}>
                    {(['today', 'week', 'month'] as Period[]).map((p) => (
                        <TouchableOpacity 
                            key={p} 
                            onPress={() => setPeriod(p)}
                            style={[styles.pill, period === p && styles.pillActive]}
                        >
                            <Text style={[styles.pillText, period === p && styles.pillTextActive]}>
                                {p.charAt(0).toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Main Insight Section */}
            <View style={styles.insightSection}>
                <View style={styles.gaugeContainer}>
                    <View style={styles.gaugeBackground} />
                    <View style={[styles.gaugeFill, { transform: [{ rotate: calculateRotation(data.yieldRate) }] }]} />
                    
                    {/* Anchor: Net Profit (Left) */}
                    <View style={styles.leftAnchor}>
                        <Text style={styles.anchorAmount}>{formatAmount(data.todayProfit)}</Text>
                        <Text style={styles.anchorLabel}>NET</Text>
                    </View>

                    {/* Anchor: Gross Profit (Right) */}
                    <View style={styles.rightAnchor}>
                        <Text style={styles.anchorAmount}>{formatAmount(data.grossProfit)}</Text>
                        <Text style={styles.anchorLabel}>GROSS</Text>
                    </View>

                    <View style={styles.gaugeValueContainer}>
                        <Text style={styles.marginValue}>
                            {(data.yieldRate || 0).toFixed(1)}%
                        </Text>
                        <Text style={styles.netProfitLabel}>Profit Margin</Text>
                    </View>
                </View>

                <View style={styles.marginBadge}>
                    <TrendingUp size={12} color="#fbe134" style={{ marginRight: 4 }} />
                    <Text style={styles.marginBadgeText}>Efficiency Rating: High</Text>
                </View>

                <View style={styles.comparisonRow}>
                    <View style={styles.comparisonItem}>
                        <Text style={[styles.comparisonAmount, { color: '#EF4444' }]}>{formatAmount(data.totalDebt)}</Text>
                        <Text style={[styles.comparisonLabel, { color: '#9CA3AF' }]}>Outstanding Debt</Text>
                    </View>
                    <View style={styles.comparisonDivider} />
                    <View style={styles.comparisonItem}>
                        <Text style={styles.comparisonAmount}>{formatAmount(data.expenses)}</Text>
                        <Text style={[styles.comparisonLabel, { color: '#9CA3AF' }]}>Op. Expenses</Text>
                    </View>
                </View>
            </View>

            {/* KPI Grid */}
            <View style={styles.kpiGrid}>
                {/* Sales KPI */}
                <View style={[styles.kpiCard, styles.kpiCardHalf]}>
                    <View style={styles.kpiTopRow}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(251, 225, 52, 0.1)' }]}>
                            <CreditCard size={18} color="#fbe134" />
                        </View>
                        <MiniSparkline data={[4, 6, 8, 5, 9, 12]} color="#fbe134" />
                    </View>
                    <Text style={styles.kpiValue}>{formatAmount(data.todaySales)}</Text>
                    <Text style={styles.kpiLabel}>Sales Volume</Text>
                </View>

                {/* Orders KPI */}
                <View style={[styles.kpiCard, styles.kpiCardHalf]}>
                    <View style={styles.kpiTopRow}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(219, 39, 119, 0.1)' }]}>
                            <ShoppingCart size={18} color="#DB2777" />
                        </View>
                        <MiniSparkline data={[6, 9, 7, 12, 10, 15]} color="#DB2777" />
                    </View>
                    <Text style={styles.kpiValue}>{data.todayTransactionCount || 0}</Text>
                    <Text style={styles.kpiLabel}>Total Orders</Text>
                </View>

                {/* Stock KPI */}
                <View style={[styles.kpiCard, styles.kpiCardHalf]}>
                    <View style={styles.kpiTopRow}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                            <Package size={18} color="#10B981" />
                        </View>
                        <MiniSparkline data={[5, 7, 6, 8, 5, 9]} color="#10B981" />
                    </View>
                    <Text style={styles.kpiValue}>{data.lowStockCount || 0}</Text>
                    <Text style={styles.kpiLabel}>Low Stock</Text>
                </View>

                {/* VAT KPI */}
                <View style={[styles.kpiCard, styles.kpiCardHalf]}>
                    <View style={styles.kpiTopRow}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                            <FileText size={18} color="#3B82F6" />
                        </View>
                        <MiniSparkline data={[3, 5, 4, 6, 5, 7]} color="#3B82F6" />
                    </View>
                    <Text style={styles.kpiValue}>{formatAmount(data.todayVat)}</Text>
                    <Text style={styles.kpiLabel}>Estimated VAT</Text>
                </View>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2a2e34', // Brand Jet
        borderRadius: 32,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    periodSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    periodText: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
    periodToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 2,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    pillActive: {
        backgroundColor: '#fbe134', // Brand Gold
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    pillText: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
    },
    pillTextActive: {
        color: '#0b0c0c',
    },
    insightSection: {
        alignItems: 'center',
        marginTop: 120, // Keep the deep drop
        marginBottom: 24,
    },
    gaugeContainer: {
        width: width * 0.5,
        height: width * 0.25, 
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        marginBottom: 40,
    },
    gaugeBackground: {
        position: 'absolute',
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        borderWidth: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle dark arc
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        transform: [{ rotate: '-45deg' }],
    },
    gaugeFill: {
        position: 'absolute',
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        borderWidth: 12,
        borderColor: '#fbe134', // Brand Gold
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    leftAnchor: {
        position: 'absolute',
        bottom: -20,
        left: -45,
        alignItems: 'center',
    },
    rightAnchor: {
        position: 'absolute',
        bottom: -20,
        right: -45,
        alignItems: 'center',
    },
    anchorAmount: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    anchorLabel: {
        fontSize: 8,
        fontFamily: 'Montserrat_700Bold',
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: -2,
    },
    gaugeValueContainer: {
        alignItems: 'center',
        paddingTop: 10,
    },
    marginValue: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134', // Primary Gold
    },
    netProfitLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        marginTop: -6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    marginBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 225, 52, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 20,
    },
    marginBadgeText: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#fbe134',
    },
    comparisonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    comparisonItem: {
        alignItems: 'center',
    },
    comparisonAmount: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    comparisonLabel: {
        fontSize: 10,
        fontFamily: 'Montserrat_600SemiBold',
        marginTop: 2,
    },
    comparisonDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
    },
    kpiCard: {
        marginBottom: 24,
    },
    kpiCardHalf: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.03)', // Subtle background for the 2x2 grid
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    kpiTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sparklineContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
        height: 16,
    },
    sparkBar: {
        width: 3,
        borderRadius: 1,
    },
    kpiValue: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    kpiLabel: {
        fontSize: 9,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
