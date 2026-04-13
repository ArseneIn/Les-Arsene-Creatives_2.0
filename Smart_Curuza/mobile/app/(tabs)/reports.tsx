import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { FileText, Download, TrendingUp, Calendar as CalendarIcon, Briefcase } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

type Period = 'Month' | 'Quarter' | 'Year';

export default function Reports() {
    const [period, setPeriod] = useState<Period>('Month');
    const [loading, setLoading] = useState(false);

    // Simulated Financial Data based on the selected period
    // Real implementation would fetch this aggregated data from the backend
    const getFinancialData = () => {
        let multiplier = period === 'Month' ? 1 : period === 'Quarter' ? 3 : 12;
        
        return {
            grossRevenue: 4500000 * multiplier,
            cogs: 1800000 * multiplier, // Cost of Goods Sold
            operatingExpenses: 1200000 * multiplier,
            netIncome: 1500000 * multiplier,
            taxEstimate: 450000 * multiplier,
            labels: period === 'Month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] : 
                    period === 'Quarter' ? ['Month 1', 'Month 2', 'Month 3'] : 
                    ['Q1', 'Q2', 'Q3', 'Q4'],
            revenueData: period === 'Month' ? [800000, 1200000, 950000, 1550000] :
                         period === 'Quarter' ? [4000000, 4500000, 5000000] :
                         [12000000, 15000000, 11000000, 16000000],
        };
    };

    const data = getFinancialData();

    // Chart Configuration
    const chartConfig = {
        backgroundColor: '#2a2e34',
        backgroundGradientFrom: '#2a2e34',
        backgroundGradientTo: '#1a1d21',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(251, 225, 52, ${opacity})`, // Gold
        labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // Gray
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#0b0c0c"
        }
    };

    const handleExport = async () => {
        setLoading(true);
        try {
            // Generate a professional CSV Statement
            let csvContent = `SMART CURUZA - FINANCIAL STATEMENT\n`;
            csvContent += `Period: ${period} ending ${new Date().toLocaleDateString()}\n\n`;
            csvContent += `Metric,Amount (RWF)\n`;
            csvContent += `Gross Revenue,${data.grossRevenue}\n`;
            csvContent += `Cost of Goods Sold (COGS),-${data.cogs}\n`;
            csvContent += `Gross Profit,${data.grossRevenue - data.cogs}\n`;
            csvContent += `Operating Expenses,-${data.operatingExpenses}\n`;
            csvContent += `EBITDA,${data.netIncome + data.taxEstimate}\n`;
            csvContent += `Estimated Tax,-${data.taxEstimate}\n`;
            csvContent += `NET INCOME,${data.netIncome}\n`;

            const fileName = `Financial_Statement_${period}_${Date.now()}.csv`;
            const fileUri = FileSystem.documentDirectory + fileName;

            await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

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
        <ScreenWrapper>
            {/* Standardized Institutional Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Financials</Text>
                        <Text style={styles.headerSub}>Official Reporting & Accounting</Text>
                    </View>
                    <View style={styles.iconBox}>
                        <Briefcase size={24} color="#fbe134" />
                    </View>
                </View>

                {/* Simplified Period Tab */}
                <View style={styles.periodTabs}>
                    {(['Month', 'Quarter', 'Year'] as Period[]).map((p) => (
                        <TouchableOpacity 
                            key={p}
                            style={[styles.tabBtn, period === p && styles.tabBtnActive]}
                            onPress={() => setPeriod(p)}
                        >
                            <Text style={[styles.tabText, period === p && styles.tabTextActive]}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                
                {/* 1. The Macro-Financial Graph */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Revenue Trajectory</Text>
                    <View style={styles.chartCard}>
                        <LineChart
                            data={{
                                labels: data.labels,
                                datasets: [{ data: data.revenueData }]
                            }}
                            width={width - 48} // Padding included
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix="    " // Padding hack for y-axis
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
                    <Text style={styles.sectionTitle}>Statement of P&L</Text>
                    <View style={styles.sheetCard}>
                        {/* GROSS */}
                        <View style={styles.sheetRow}>
                            <Text style={styles.sheetLabel}>Gross Revenue</Text>
                            <Text style={styles.sheetValue}>{data.grossRevenue.toLocaleString()}</Text>
                        </View>
                        <View style={styles.sheetRow}>
                            <Text style={styles.sheetLabel}>Cost of Goods (COGS)</Text>
                            <Text style={[styles.sheetValue, { color: '#EF4444' }]}>- {data.cogs.toLocaleString()}</Text>
                        </View>
                        <View style={styles.sheetDivider} />
                        
                        {/* GROSS PROFIT */}
                        <View style={styles.sheetRow}>
                            <Text style={[styles.sheetLabel, { fontFamily: 'Montserrat_700Bold' }]}>Gross Profit</Text>
                            <Text style={[styles.sheetValue, { fontFamily: 'Poppins_700Bold' }]}>{(data.grossRevenue - data.cogs).toLocaleString()}</Text>
                        </View>

                        {/* OPEX */}
                        <View style={[styles.sheetRow, { marginTop: 16 }]}>
                            <Text style={styles.sheetLabel}>Operating Expenses</Text>
                            <Text style={[styles.sheetValue, { color: '#EF4444' }]}>- {data.operatingExpenses.toLocaleString()}</Text>
                        </View>

                        <View style={styles.sheetDivider} />

                        {/* EBITDA */}
                        <View style={styles.sheetRow}>
                            <Text style={[styles.sheetLabel, { fontFamily: 'Montserrat_700Bold' }]}>EBITDA</Text>
                            <Text style={[styles.sheetValue, { fontFamily: 'Poppins_700Bold' }]}>{(data.netIncome + data.taxEstimate).toLocaleString()}</Text>
                        </View>
                        
                        <View style={styles.sheetRow}>
                            <Text style={styles.sheetLabel}>Estimated Tax</Text>
                            <Text style={[styles.sheetValue, { color: '#EF4444' }]}>- {data.taxEstimate.toLocaleString()}</Text>
                        </View>

                        <View style={styles.sheetDividerHeavy} />

                        {/* NET INCOME */}
                        <View style={styles.sheetRow}>
                            <Text style={styles.sheetTotalLabel}>NET INCOME</Text>
                            <Text style={styles.sheetTotalValue}>{data.netIncome.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
                        </View>
                    </View>
                </View>

                {/* 3. Official Export Engine */}
                <View style={styles.exportSection}>
                    <TouchableOpacity 
                        style={styles.exportButton}
                        onPress={handleExport}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0b0c0c" />
                        ) : (
                            <>
                                <Download size={20} color="#0b0c0c" style={{ marginRight: 8 }} />
                                <Text style={styles.exportButtonText}>Export Official Statement</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.exportDisclaimer}>Generates a secure CSV compilation for external banking or accounting use.</Text>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2a2e34', 
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    headerSub: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: -4,
    },
    iconBox: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(251, 225, 52, 0.1)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    periodTabs: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: 'rgba(0,0,0,0.2)',
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
        backgroundColor: '#fbe134',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
    },
    tabTextActive: {
        color: '#0b0c0c',
    },
    container: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    chartCard: {
        backgroundColor: '#2a2e34',
        borderRadius: 24,
        paddingVertical: 20,
        paddingRight: 20, // To give room for text
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
        alignItems: 'center',
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
    sheetCard: {
        backgroundColor: '#f3f4f6', // Light Grey "Statement" Look
        borderRadius: 24,
        padding: 24,
        borderTopWidth: 4,
        borderTopColor: '#fbe134', // Gold Seal
        shadowColor: '#000',
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
        color: '#4B5563',
    },
    sheetValue: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: '#111827',
    },
    sheetDivider: {
        height: 1,
        backgroundColor: '#D1D5DB',
        marginVertical: 12,
    },
    sheetDividerHeavy: {
        height: 2,
        backgroundColor: '#111827',
        marginVertical: 12,
    },
    sheetTotalLabel: {
        fontSize: 16,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#111827',
    },
    sheetTotalValue: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#2a2e34',
    },
    currency: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    exportSection: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 100, // Room for nav bar
        alignItems: 'center',
    },
    exportButton: {
        flexDirection: 'row',
        backgroundColor: '#fbe134', // Solid Gold
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
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
        color: '#9CA3AF',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 16,
    }
});
