import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator } from 'react-native';
import { X, Calendar, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiClient } from '../lib/api_client';
import { useTheme } from '../lib/theme/ThemeContext';

interface ClientHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    client: { id: string; name: string } | null;
}

export default function ClientHistoryModal({ visible, onClose, client }: ClientHistoryModalProps) {
    const { colors } = useTheme();
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
        <View style={[styles.saleCard, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
            <View style={styles.saleHeader}>
                <View style={styles.dateBox}>
                    <Calendar size={14} color={colors.textSecondary} />
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={[styles.totalText, { color: colors.textPrimary }]}>{item.total.toLocaleString()} RWF</Text>
            </View>
            
            <View style={[styles.itemPreview, { backgroundColor: colors.card }]}>
                <ShoppingBag size={14} color={colors.brandGold} />
                <Text style={[styles.itemsText, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(', ') || 'No items'}
                </Text>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.methodText, { color: colors.brandGold }]}>{item.payment_method}</Text>
                <View style={[styles.statusBadge, item.status === 'REFUNDED' ? styles.refundedBadge : styles.completedBadge]}>
                    <Text style={styles.statusText}>{item.status || 'COMPLETED'}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: colors.card, paddingBottom: insets.bottom + 20 }]}>
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <View>
                            <Text style={[styles.title, { color: colors.textPrimary }]}>Transaction History</Text>
                            <Text style={[styles.subtitle, { color: colors.brandGold }]}>{client?.name || 'Customer'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.overlay }]}>
                            <X size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.brandGold} />
                            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Fetching Records...</Text>
                        </View>
                    ) : sales.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <ShoppingBag size={48} color={colors.textSecondary} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions found</Text>
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
