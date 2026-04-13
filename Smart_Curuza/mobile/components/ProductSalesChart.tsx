import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { ApiClient } from '../lib/api_client';

const { width } = Dimensions.get('window');

interface ProductSalesChartProps {
    period: 'today' | 'week' | 'month';
}

export default function ProductSalesChart({ period }: ProductSalesChartProps) {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            setLoading(true);
            try {
                const products = await ApiClient.getProducts();
                
                // Simulate period-based variance for the top 5
                const mult = period === 'month' ? 100 : period === 'week' ? 25 : 8;
                
                const sorted = products
                    .map(p => ({
                        name: p.name,
                        sales: Math.floor(Math.random() * mult) + 2,
                        amount: (Math.floor(Math.random() * mult * 10000) + 50000).toLocaleString()
                    }))
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5);
                
                setStats(sorted);
            } catch (error) {
                console.error('Error fetching product sales:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [period]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fbe134" />
            </View>
        );
    }

    // Determine max sales for relative bar width
    const maxSales = stats.length > 0 ? Math.max(...stats.map(s => s.sales)) : 1;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Top Peforming Products</Text>
            
            <View style={styles.chartBoard}>
                {stats.map((product, index) => (
                    <View key={index} style={styles.barRow}>
                        <View style={styles.labelRow}>
                            <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                            <Text style={styles.amountText}>{product.amount} <Text style={{fontSize: 9, color: '#9CA3AF'}}>RWF</Text></Text>
                        </View>
                        
                        <View style={styles.barTrack}>
                            <View 
                                style={[
                                    styles.barFill, 
                                    { width: `${(product.sales / maxSales) * 100}%` }
                                ]} 
                            />
                        </View>
                    </View>
                ))}
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
        backgroundColor: '#2a2e34',
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
});
