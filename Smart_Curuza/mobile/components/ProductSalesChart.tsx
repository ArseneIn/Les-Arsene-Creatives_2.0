import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '../lib/theme/ThemeContext';

const { width } = Dimensions.get('window');

interface ProductSalesChartProps {
    period: 'today' | 'week' | 'month';
    data: any[];
    loading: boolean;
}

export default function ProductSalesChart({ data, loading }: ProductSalesChartProps) {
    const { colors, isDarkMode } = useTheme();

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.card }]}>
                <ActivityIndicator color={colors.brandGold} />
            </View>
        );
    }

    const stats = data || [];
    const maxSales = stats.length > 0 ? Math.max(...stats.map(s => s.sales)) : 1;

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Top Performing Products</Text>
            
            <View style={[styles.chartBoard, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#000' : '#E5E7EB' }]}>
                {stats.length > 0 ? (
                    stats.map((product, index) => (
                        <View key={index} style={styles.barRow}>
                            <View style={styles.labelRow}>
                                <Text style={[styles.productName, { color: colors.textPrimary }]} numberOfLines={1}>
                                    {product.name}
                                </Text>
                                <Text style={[styles.amountText, { color: colors.brandGold }]}>
                                    {product.amount} <Text style={{ fontSize: 9, color: colors.textSecondary }}>RWF</Text>
                                </Text>
                            </View>
                            
                            <View style={[styles.barTrack, { backgroundColor: colors.cardOverlay }]}>
                                <View 
                                    style={[
                                        styles.barFill, 
                                        { width: `${(product.sales / maxSales) * 100}%`, backgroundColor: colors.brandGold }
                                    ]} 
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyDot, { backgroundColor: colors.border }]} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No sales volume recorded in this period yet.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2a2e34',
        borderRadius: 24,
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
    chartBoard: {
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    barRow: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    productName: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 10,
    },
    amountText: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
    },
    barTrack: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#fbe134',
        borderRadius: 3,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 12,
    },
    emptyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    emptyText: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    }
});
