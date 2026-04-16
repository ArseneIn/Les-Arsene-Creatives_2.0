import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { CreditCard, Package, Users, FileText, ChevronDown, TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ApiClient } from '../lib/api_client';
import SkeletonLoader from './SkeletonLoader';

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
    data: DashboardStatsData | null;
    loading: boolean;
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

const DashboardSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Header Skeleton */}
            <View style={styles.headerRow}>
                <SkeletonLoader width={100} height={20} />
                <SkeletonLoader width={120} height={32} borderRadius={12} />
            </View>

            {/* Main Insight Section Skeleton */}
            <View style={styles.insightSection}>
                <View style={{ width: width * 0.5, height: width * 0.25, alignItems: 'center', marginBottom: 20 }}>
                     <SkeletonLoader 
                          width={width * 0.5} 
                          height={width * 0.25} 
                          borderRadius={width * 0.25} 
                          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, overflow: 'hidden' }} 
                     />
                </View>
                
                <View style={styles.kpiRow}>
                    <SkeletonLoader width={80} height={40} borderRadius={8} />
                    <SkeletonLoader width={80} height={24} borderRadius={8} />
                    <SkeletonLoader width={80} height={40} borderRadius={8} />
                </View>

                <View style={[styles.comparisonRow, { marginTop: 24 }]}>
                    <SkeletonLoader width={120} height={40} borderRadius={8} />
                    <View style={styles.comparisonDivider} />
                    <SkeletonLoader width={120} height={40} borderRadius={8} />
                </View>
            </View>

            {/* KPI Grid Skeleton */}
            <View style={styles.kpiGrid}>
                {[1, 2, 3, 4].map(key => (
                    <View key={key} style={[styles.kpiCard, styles.kpiCardHalf, { padding: 0, borderWidth: 0, backgroundColor: 'transparent' }]}>
                        <SkeletonLoader width="100%" height={90} borderRadius={20} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default function DashboardStats({ period, setPeriod, data, loading }: DashboardStatsProps) {
    if (loading || !data) {
        return <DashboardSkeleton />;
    }

    const formatAmount = (val: any) => {
        if (typeof val !== 'number' || isNaN(val)) return '0';
        return val.toLocaleString();
    };

    const stats = data;

    const calculateYieldOffset = (yieldRate: number) => {
        const safeMargin = Math.min(Math.max(yieldRate || 0, 0), 100);
        const strokeWidth = 12;
        const glowWidth = 20;
        const padding = glowWidth / 2; // 10
        // radius = (width*0.5)/2 - padding
        const radius = (width * 0.5) / 2 - padding;
        const circumference = Math.PI * radius;
        return circumference - (circumference * (safeMargin / 100));
    };

    const gaugeWidth = width * 0.5;
    const gaugeHeight = gaugeWidth * 0.5; // Always half of width to maintain perfect semi-circle
    const strokeWidth = 12;
    const glowWidth = 20;
    const padding = glowWidth / 2 + 2; // 12 for safety
    
    const cx = gaugeWidth / 2;
    const cy = gaugeHeight;
    const radius = gaugeWidth / 2 - padding;

    // Start left, go up to center, come down right
    const startX = cx - radius;
    const endX = cx + radius;
    const arcPath = `M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`;
    const circumference = Math.PI * radius;

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
                <View style={styles.gaugeWrapper}>
                    <Svg width={gaugeWidth} height={gaugeHeight} style={styles.svgGauge}>
                        <Defs>
                            <LinearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0" stopColor="#B45309" stopOpacity="1" />
                                <Stop offset="0.5" stopColor="#fbe134" stopOpacity="1" />
                                <Stop offset="1" stopColor="#FDE047" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        
                        {/* Glowing backdrop path for 3D effect */}
                        <Path 
                            d={arcPath}
                            stroke="#fbe134"
                            strokeWidth={strokeWidth + 8}
                            strokeOpacity={0.15}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={calculateYieldOffset(data.yieldRate)}
                        />
                        
                        {/* Background track */}
                        <Path 
                            d={arcPath}
                            stroke="rgba(255, 255, 255, 0.05)"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                        />
                        
                        {/* Fill track with gradient */}
                        <Path 
                            d={arcPath}
                            stroke="url(#goldGlow)"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={calculateYieldOffset(data.yieldRate)}
                        />
                    </Svg>

                    <View style={styles.gaugeValueContainer}>
                        <Text style={styles.marginValue}>
                            {(data.yieldRate || 0).toFixed(1)}%
                        </Text>
                        <Text style={styles.netProfitLabel}>PROFIT MARGIN</Text>
                    </View>
                </View>

                {/* KPI Sub-row directly below graph */}
                <View style={styles.kpiRow}>
                    <View style={styles.kpiItem}>
                        <Text style={styles.metricLabel}>NET PROFIT</Text>
                        <Text style={styles.metricValueGreen} numberOfLines={1}>
                            {formatAmount(data.todayProfit)}
                        </Text>
                    </View>
                    
                    <View style={styles.marginBadge}>
                        <TrendingUp size={12} color="#0b0c0c" style={{ marginRight: 4 }} />
                        <Text style={styles.marginBadgeText}>HIGH YIELD</Text>
                    </View>
                    
                    <View style={styles.kpiItem}>
                        <Text style={styles.metricLabel}>GROSS REV</Text>
                        <Text style={styles.metricValueWhite} numberOfLines={1}>
                            {formatAmount(data.grossProfit)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.comparisonRow, { marginTop: 24 }]}>
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
        marginTop: 40, // Reduced from 120
        marginBottom: 24,
    },
    gaugeWrapper: {
        width: width * 0.5,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 8, // Tighter gap
    },
    svgGauge: {
        marginBottom: 0,
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
        marginTop: -30, // Pull it up slightly into the empty space of the arc
        zIndex: 10,
    },
    marginValue: {
        fontSize: 36,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF', 
        textShadowColor: 'rgba(255, 255, 255, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    netProfitLabel: {
        fontSize: 10,
        fontFamily: 'Montserrat_700Bold',
        color: '#fbe134', // Gold label
        marginTop: -4,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    kpiRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%', // Increased width to prevent wrapping
        paddingHorizontal: 12, // Add some padding since it's full width
        marginTop: 6,
    },
    kpiItem: {
        alignItems: 'center',
        flex: 1,
        overflow: 'hidden', // Contain the wrapped text
    },
    metricLabel: {
        fontSize: 9,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 4,
    },
    metricValueGreen: {
        fontSize: 14, // Lowered
        fontFamily: 'Poppins_700Bold',
        color: '#10B981', // Emerald
    },
    metricValueWhite: {
        fontSize: 14, // Lowered
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    marginBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fbe134', // Solid Gold shield
        paddingHorizontal: 6, // Slightly tighter
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 4,
        marginHorizontal: 4, // Tighter margin
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    marginBadgeText: {
        fontSize: 9,
        fontFamily: 'Montserrat_700Bold',
        color: '#0b0c0c',
        letterSpacing: 0.5,
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
