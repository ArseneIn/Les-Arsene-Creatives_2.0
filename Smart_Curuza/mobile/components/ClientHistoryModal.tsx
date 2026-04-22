import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator } from 'react-native';
import { X, Calendar, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiClient } from '../lib/api_client';

interface ClientHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    client: { id: string; name: string } | null;
}

export default function ClientHistoryModal({ visible, onClose, client }: ClientHistoryModalProps) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [sales, setSales] = useState<any[]>([]);

    useEffect(() => {
        if (visible && client) {
            fetchHistory();
        }
    }, [visible, client]);

    const fetchHistory = async () => {
        if (!client) return;
        setLoading(true);
        try {
            const data = await ApiClient.getCustomerSales(client.id);
            setSales(data);
        } catch (error) {
            console.error('History: error fetching', error);
        } finally {
            setLoading(false);
        }
    };

    const renderSaleItem = ({ item }: { item: any }) => (
        <View style={styles.saleCard}>
            <View style={styles.saleHeader}>
                <View style={styles.dateBox}>
                    <Calendar size={14} color="#9CA3AF" />
                    <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.totalText}>{item.total.toLocaleString()} RWF</Text>
            </View>
            
            <View style={styles.itemPreview}>
                <ShoppingBag size={14} color="#fbe134" />
                <Text style={styles.itemsText} numberOfLines={1}>
                    {item.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(', ') || 'No items'}
                </Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.methodText}>{item.payment_method}</Text>
                <View style={[styles.statusBadge, item.status === 'REFUNDED' ? styles.refundedBadge : styles.completedBadge]}>
                    <Text style={styles.statusText}>{item.status || 'COMPLETED'}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Transaction History</Text>
                            <Text style={styles.subtitle}>{client?.name || 'Customer'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fbe134" />
                            <Text style={styles.loadingText}>Fetching Records...</Text>
                        </View>
                    ) : sales.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <ShoppingBag size={48} color="#2a2e34" />
                            <Text style={styles.emptyText}>No transactions found</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={sales}
                            renderItem={renderSaleItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#1a1d21',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '80%',
        width: '100%',
    },
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#fbe134',
    },
    closeButton: {
        width: 40,
        height: 40,
        backgroundColor: '#2a2e34',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 24,
        gap: 16,
    },
    saleCard: {
        backgroundColor: '#2a2e34',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    saleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
    totalText: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    itemPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1a1d21',
        padding: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    itemsText: {
        flex: 1,
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#D1D5DB',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    methodText: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#fbe134',
        textTransform: 'uppercase',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    completedBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    refundedBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#9CA3AF',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
});
