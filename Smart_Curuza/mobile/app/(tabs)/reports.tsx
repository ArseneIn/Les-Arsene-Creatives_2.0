import React, { useState, useEffect, useCallback } from 'react';
import * as RN from 'react-native';
const { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, ActivityIndicator, RefreshControl } = RN;
import { FileText, Download, TrendingUp, Calendar as CalendarIcon, Briefcase, AlertTriangle } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ApiClient } from '../../lib/api_client';
import { useTheme } from '../../lib/theme/ThemeContext';
import { useAuth } from '../../lib/auth/AuthContext';
import { Headphones, MessageSquare, PhoneCall, Globe, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type Period = 'Month' | 'Quarter' | 'Year';

export default function Reports() {
    const { colors, isDarkMode } = useTheme();
    const { user } = useAuth();
    const isCashier = user?.role === 'CASHIER';
    const insets = useSafeAreaInsets();
    const [period, setPeriod] = useState<Period>('Month');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Financial Data State
    const [financialData, setFinancialData] = useState({
        grossRevenue: 0,
        cogs: 0,
        operatingExpenses: 0,
        netIncome: 0,
        taxEstimate: 0,
        vat: 0,
        labels: [] as string[],
        revenueData: [0],
    });

    const fetchReportData = async (bypassCache = false) => {
        setLoading(true);
        try {
            // 1. Map frontend period to backend export period
            const exportPeriod = period === 'Month' ? 'weekly' : period === 'Quarter' ? 'monthly' : 'quarterly';
            
            // 2. Calculate date range for Expenses Summary
            const now = new Date();
            let startDate = new Date();
            if (period === 'Month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            } else if (period === 'Quarter') {
                const currentQuarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
            } else {
                startDate = new Date(now.getFullYear(), 0, 1);
            }
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = now.toISOString().split('T')[0];

            // 3. Concurrent fetch: Sales Export + Expenses Summary
            const [salesExport, expensesSummary] = await Promise.all([
                ApiClient.getSalesExport(exportPeriod),
                ApiClient.getExpensesSummary(startDateStr, endDateStr, bypassCache)
            ]);

            // 4. Process Sales Data
            // We slice the summary to get relevant segments for the chart (last 4-6 segments)
            const summarySegments = salesExport.summary || [];
            const sliceCount = period === 'Month' ? 4 : period === 'Quarter' ? 3 : 4;
            const recentSegments = summarySegments.slice(-sliceCount);

            // Calculate totals from ALL detail records within the selected date range
            // (Note: getSalesExport historically returns all data, so we filter by startDate for the P&L statement)
            const details = salesExport.details || [];
            const filterDate = startDate.getTime();
            
            let totalRevenue = 0;
            let totalCost = 0;
            let totalVat = 0;

            details.forEach((item: any) => {
                const saleDate = new Date(item.date).getTime();
                if (saleDate >= filterDate) {
                    totalRevenue += Number(item.total) || 0;
                    totalCost += Number(item.cost) || 0;
                    totalVat += Number(item.vat) || 0;
                }
            });

            const totalExpenses = Number(expensesSummary.total) || 0;
            const netIncome = (totalRevenue - totalCost - totalVat) - totalExpenses;
            const taxEstimate = netIncome > 0 ? netIncome * 0.15 : 0; // 15% estimated corporate tax

            // 5. Update State
            setFinancialData({
                grossRevenue: totalRevenue,
                cogs: totalCost,
                operatingExpenses: totalExpenses,
                netIncome: netIncome,
                taxEstimate: taxEstimate,
                vat: totalVat,
                labels: recentSegments.length > 0 ? recentSegments.map((s: any) => s.period.split(',')[0]) : ['No Data'],
                revenueData: recentSegments.length > 0 ? recentSegments.map((s: any) => Number(s.revenue)) : [0],
            });

        } catch (error) {
            console.error('Reports: Failed to fetch data', error);
            Alert.alert('Data Error', 'Could not load real financial records. Showing last known state.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReportData();
        }, [period])
    );

    const data = financialData;

    // Chart Configuration
    const chartConfig = {
        backgroundColor: colors.card,
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(251, 225, 52, ${opacity})`, // Gold
        labelColor: (opacity = 1) => isDarkMode ? `rgba(156, 163, 175, ${opacity})` : `rgba(75, 85, 99, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: isDarkMode ? "#0b0c0c" : colors.card
        }
    };

    if (isCashier) {
        return (
            <ScreenWrapper safeArea={false} style={{ backgroundColor: colors.background }}>
                <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: isDarkMode ? colors.card : colors.brandGold }]}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>Support</Text>
                            <Text style={[styles.headerSub, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#4B5563' }]}>Help Center & Merchant Assistance</Text>
                        </View>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(251, 225, 52, 0.1)' : 'rgba(255, 255, 255, 0.2)' }]}>
                            <Headphones size={24} color={isDarkMode ? '#fbe134' : '#111827'} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Quick Help</Text>
                        <View style={[styles.sheetCard, { backgroundColor: colors.card, borderTopColor: colors.brandGold }]}>
                            <TouchableOpacity style={styles.supportItem} onPress={() => Alert.alert("Support", "Connecting to live chat...")}>
                                <View style={[styles.supportIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                    <MessageSquare size={20} color="#3B82F6" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.supportLabel, { color: colors.textPrimary }]}>Live Chat</Text>
                                    <Text style={[styles.supportDesc, { color: colors.textSecondary }]}>Chat with our support team</Text>
                                </View>
                                <ChevronRight size={18} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.supportItem} onPress={() => RN.Linking.openURL('tel:+250780000000')}>
                                <View style={[styles.supportIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                                    <PhoneCall size={20} color="#22C55E" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.supportLabel, { color: colors.textPrimary }]}>Call Support</Text>
                                    <Text style={[styles.supportDesc, { color: colors.textSecondary }]}>Available 24/7 for merchants</Text>
                                </View>
                                <ChevronRight size={18} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.supportItem} onPress={() => RN.Linking.openURL('https://smartcuruza.rw')}>
                                <View style={[styles.supportIcon, { backgroundColor: 'rgba(251, 225, 52, 0.1)' }]}>
                                    <Globe size={20} color={colors.brandGold} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.supportLabel, { color: colors.textPrimary }]}>Knowledge Base</Text>
                                    <Text style={[styles.supportDesc, { color: colors.textSecondary }]}>Read guides and tutorials</Text>
                                </View>
                                <ChevronRight size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={[styles.alertCard, { backgroundColor: 'rgba(251, 225, 52, 0.05)', borderColor: 'rgba(251, 225, 52, 0.2)' }]}>
                            <View style={[styles.alertIconBox, { backgroundColor: 'rgba(251, 225, 52, 0.1)' }]}>
                                <AlertTriangle size={20} color={colors.brandGold} />
                            </View>
                            <View style={styles.alertContent}>
                                <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>Admin Access Required</Text>
                                <Text style={[styles.alertDesc, { color: colors.textSecondary }]}>Detailed financial reports are only accessible by business owners and administrators.</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ScreenWrapper>
        );
    }

    const handleExport = async () => {
        setLoading(true);
        try {
            // Generate a professional CSV Statement from live data
            let csvContent = `SMART CURUZA - FINANCIAL STATEMENT\n`;
            csvContent += `Period: ${period} ending ${new Date().toLocaleDateString()}\n\n`;
            csvContent += `Metric,Amount (RWF)\n`;
            csvContent += `Gross Revenue,${data.grossRevenue}\n`;
            csvContent += `Cost of Goods Sold (COGS),-${data.cogs}\n`;
            csvContent += `VAT Paid,-${data.vat}\n`;
            csvContent += `Gross Profit,${data.grossRevenue - data.cogs - data.vat}\n`;
            csvContent += `Operating Expenses,-${data.operatingExpenses}\n`;
            csvContent += `Net Income Before Tax,${data.netIncome}\n`;
            csvContent += `Estimated Tax,-${data.taxEstimate}\n`;
            csvContent += `FINAL NET INCOME,${data.netIncome - data.taxEstimate}\n`;

            const fileName = `Financial_Statement_${period}_${Date.now()}.csv`;
            const fileUri = `${(FileSystem as any).documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, csvContent, { 
                encoding: (FileSystem as any).EncodingType.UTF8 
            });

            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Error', 'Sharing is not available on this device');
                return;
            }

            await Sharing.shareAsync(fileUri, {
                mimeType: 'text/csv',
                dialogTitle: 'Export Official Statement',
                UTI: 'public.comma-separated-values-text'
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Export Failed', 'There was an error generating your statement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper safeArea={false} style={{ backgroundColor: colors.background }}>
            {/* Standardized Institutional Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: isDarkMode ? colors.card : colors.brandGold }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>Financials</Text>
                        <Text style={[styles.headerSub, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#4B5563' }]}>Official Reporting & Accounting</Text>
                    </View>
                    <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(251, 225, 52, 0.1)' : 'rgba(255, 255, 255, 0.2)' }]}>
                        <Briefcase size={24} color={isDarkMode ? '#fbe134' : '#111827'} />
                    </View>
                </View>

                {/* Simplified Period Tab */}
                <View style={[styles.periodTabs, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }]}>
                    {(['Month', 'Quarter', 'Year'] as Period[]).map((p) => (
                        <TouchableOpacity 
                            key={p}
                            style={[
                                styles.tabBtn, 
                                period === p && [styles.tabBtnActive, { backgroundColor: isDarkMode ? '#fbe134' : '#FFFFFF', shadowColor: isDarkMode ? '#fbe134' : 'rgba(0,0,0,0.1)' }]
                            ]}
                            onPress={() => setPeriod(p)}
                        >
                            <Text style={[
                                styles.tabText, 
                                { color: isDarkMode ? '#9CA3AF' : '#6B7280' },
                                period === p && [styles.tabTextActive, { color: isDarkMode ? '#0b0c0c' : '#0b0c0c' }]
                            ]}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchReportData(true);
                        }}
                        tintColor={colors.brandGold}
                    />
                }
            >
                {loading && !refreshing ? (
                    <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.brandGold} />
                        <Text style={{ color: colors.textSecondary, marginTop: 16, fontFamily: 'Montserrat_500Medium' }}>Retrieving Global Ledger...</Text>
                    </View>
                ) : (
                    <>
                        {/* 1. The Macro-Financial Graph */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Revenue Trajectory</Text>
                            <View style={[styles.chartCard, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#000': '#E5E7EB' }]}>
                                <LineChart
                                    data={{
                                        labels: data.labels,
                                        datasets: [{ data: data.revenueData }]
                                    }}
                                    width={width - 48} // Padding included
                                    height={220}
                                    yAxisLabel=""
                                    yAxisSuffix="" 
                                    chartConfig={chartConfig}
                                    bezier
                                    style={styles.chartStyle}
                                    formatYLabel={(y) => {
                                        const num = parseInt(y);
                                        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
                                        if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
                                        return y;
                                    }}
                                />
                            </View>
                        </View>

                        {/* 2. Strict Profit & Loss (P&L) Statement */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Statement of P&L</Text>
                            <View style={[styles.sheetCard, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#000' : '#E5E7EB' }]}>
                                {/* GROSS */}
                                <View style={styles.sheetRow}>
                                    <Text style={[styles.sheetLabel, { color: colors.textSecondary }]}>Gross Revenue</Text>
                                    <Text style={[styles.sheetValue, { color: colors.textPrimary }]}>{data.grossRevenue.toLocaleString()}</Text>
                                </View>
                                <View style={styles.sheetRow}>
                                    <Text style={[styles.sheetLabel, { color: colors.textSecondary }]}>Cost of Goods (COGS)</Text>
                                    <Text style={[styles.sheetValue, { color: colors.danger }]}>- {data.cogs.toLocaleString()}</Text>
                                </View>
                                <View style={styles.sheetRow}>
                                    <Text style={[styles.sheetLabel, { color: colors.textSecondary }]}>VAT Collected</Text>
                                    <Text style={[styles.sheetValue, { color: colors.danger }]}>- {data.vat.toLocaleString()}</Text>
                                </View>
                                <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />
                                
                                {/* GROSS PROFIT */}
                                <View style={styles.sheetRow}>
                                    <Text style={[styles.sheetLabel, { fontFamily: 'Montserrat_700Bold', color: colors.textPrimary }]}>Gross Profit</Text>
                                    <Text style={[styles.sheetValue, { fontFamily: 'Poppins_700Bold', color: colors.brandGold }]}>{(data.grossRevenue - data.cogs - data.vat).toLocaleString()}</Text>
                                </View>

                                {/* OPEX */}
                                <View style={[styles.sheetRow, { marginTop: 16 }]}>
                                    <Text style={[styles.sheetLabel, { color: colors.textSecondary }]}>Operating Expenses</Text>
                                    <Text style={[styles.sheetValue, { color: colors.danger }]}>- {data.operatingExpenses.toLocaleString()}</Text>
                                </View>

                                <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

                                {/* EBITDA (Approximate) */}
                                <View style={styles.sheetRow}>
                                    <Text style={[styles.sheetLabel, { fontFamily: 'Montserrat_700Bold', color: colors.textPrimary }]}>Income Before Tax</Text>
                                    <Text style={[styles.sheetValue, { fontFamily: 'Poppins_700Bold', color: colors.textPrimary }]}>{data.netIncome.toLocaleString()}</Text>
                                </View>
                                
                                <View style={styles.sheetRow}>
                                    <Text style={[styles.sheetLabel, { color: colors.textSecondary }]}>Estimated Corp. Tax</Text>
                                    <Text style={[styles.sheetValue, { color: colors.danger }]}>- {Math.floor(data.taxEstimate).toLocaleString()}</Text>
                                </View>

                                <View style={[styles.sheetDividerHeavy, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

                                {/* NET INCOME */}
                                <View style={styles.sheetRow}>
                                    <Text style={[styles.sheetTotalLabel, { color: colors.textPrimary }]}>FINAL NET INCOME</Text>
                                    <Text style={styles.sheetTotalValue}>{(data.netIncome - data.taxEstimate).toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* 3. Official Export Engine */}
                <View style={[styles.exportSection, loading && { opacity: 0.5 }]}>
                    <TouchableOpacity 
                        style={styles.exportButton}
                        onPress={handleExport}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading && !refreshing ? (
                            <ActivityIndicator color="#0b0c0c" />
                        ) : (
                            <>
                                <Download size={20} color="#0b0c0c" style={{ marginRight: 8 }} />
                                <Text style={styles.exportButtonText}>Export Official Statement</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <Text style={[styles.exportDisclaimer, { color: colors.textSecondary }]}>Generates a secure CSV compilation for external banking or accounting use.</Text>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}


const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        zIndex: 100,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
    },
    headerSub: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        marginTop: -4,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    periodTabs: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        padding: 4,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabBtnActive: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
    },
    tabTextActive: {
    },
    scrollView: {
        flex: 1,
        marginTop: -32,
    },
    scrollContent: {
        paddingTop: 48,
        paddingBottom: 100,
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    chartCard: {
        borderRadius: 24,
        paddingVertical: 20,
        paddingRight: 20, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        alignItems: 'center',
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
    sheetCard: {
        borderRadius: 24,
        padding: 24,
        borderTopWidth: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sheetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sheetLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
    },
    sheetValue: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
    },
    sheetDivider: {
        height: 1,
        marginVertical: 12,
    },
    sheetDividerHeavy: {
        height: 2,
        marginVertical: 12,
    },
    sheetTotalLabel: {
        fontSize: 16,
        fontFamily: 'Montserrat_800ExtraBold',
    },
    sheetTotalValue: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
    },
    currency: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    exportSection: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 100, 
        alignItems: 'center',
    },
    exportButton: {
        flexDirection: 'row',
        backgroundColor: '#fbe134', 
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 16,
    },
    exportButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
    exportDisclaimer: {
        fontSize: 11,
        fontFamily: 'Montserrat_500Medium',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 16,
    },
    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 16,
    },
    supportIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    supportLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
    },
    supportDesc: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
    },
    alertCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    alertIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        marginBottom: 4,
    },
    alertDesc: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        lineHeight: 18,
    },
});
