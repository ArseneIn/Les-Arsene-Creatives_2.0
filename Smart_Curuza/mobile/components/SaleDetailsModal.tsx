import React, { useState } from 'react';
import * as RN from 'react-native';
const { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } = RN;
import { X, Calendar, User, CreditCard, Check, Clock, AlertTriangle, Printer, Trash2 } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

interface SaleItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface SaleRecord {
    id: string;
    created_at: string;
    customer?: { name: string; email?: string; phone?: string };
    items: SaleItem[];
    total: number;
    vat_amount?: number;
    net_amount?: number;
    payment_method: string;
    sync_status: string;
    status?: string; // 'COMPLETED' | 'REFUNDED'
    profit?: number;
}

interface SaleDetailsModalProps {
    visible: boolean;
    sale: SaleRecord | null;
    onClose: () => void;
    onRefundSuccess: () => void;
}

export default function SaleDetailsModal({ visible, sale, onClose, onRefundSuccess }: SaleDetailsModalProps) {
    const [processing, setProcessing] = useState(false);

    if (!sale) return null;

    const handleRefund = () => {
        Alert.alert(
            "Refund Sale",
            "Are you sure you want to refund this sale? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Refund",
                    style: "destructive",
                    onPress: async () => {
                        setProcessing(true);
                        try {
                            await ApiClient.refundSale(sale.id, "Customer Request", true);
                            Alert.alert("Success", "Sale refunded successfully");
                            onRefundSuccess();
                            onClose();
                        } catch (error) {
                            Alert.alert("Error", "Failed to refund sale");
                        } finally {
                            setProcessing(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Transaction Details</Text>
                            <Text style={styles.headerSubtitle}>#{sale.id.substring(0, 8)}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {/* Status Cards */}
                        <View style={styles.statusGrid}>
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <Calendar size={16} color="#6B7280" />
                                    <Text style={styles.infoText}>{new Date(sale.created_at).toLocaleString()}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <User size={16} color="#6B7280" />
                                    <Text style={styles.infoText}>{sale.customer?.name || 'Walk-in Customer'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <CreditCard size={16} color="#6B7280" />
                                    <Text style={styles.infoText}>{sale.payment_method}</Text>
                                </View>
                            </View>

                            <View style={styles.statusCard}>
                                <Text style={styles.statusLabel}>Sync Status</Text>
                                <View style={[
                                    styles.statusBadge,
                                    sale.sync_status === 'Completed' ? styles.bgGreen :
                                        sale.sync_status === 'Pending' ? styles.bgOrange : styles.bgRed
                                ]}>
                                    {sale.sync_status === 'Completed' && <Check size={14} color="#15803D" />}
                                    {sale.sync_status === 'Pending' && <Clock size={14} color="#C2410C" />}
                                    {sale.sync_status === 'Failed' && <AlertTriangle size={14} color="#B91C1C" />}
                                    <Text style={[
                                        styles.statusText,
                                        sale.sync_status === 'Completed' ? styles.textGreen :
                                            sale.sync_status === 'Pending' ? styles.textOrange : styles.textRed
                                    ]}>
                                        {sale.sync_status}
                                    </Text>
                                </View>

                                {sale.status === 'REFUNDED' && (
                                    <View style={[styles.statusBadge, styles.bgRed, { marginTop: 8 }]}>
                                        <AlertTriangle size={14} color="#B91C1C" />
                                        <Text style={[styles.statusText, styles.textRed]}>REFUNDED</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Items List */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Items Purchased</Text>
                            <View style={styles.itemsTable}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Product</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Qty</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
                                </View>
                                {sale.items.map((item, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
                                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{item.quantity}</Text>
                                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: '600' }]}>
                                            {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Financial Summary */}
                        <View style={styles.summarySection}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal (Excl. VAT)</Text>
                                <Text style={styles.summaryValue}>{sale.net_amount ? Number(sale.net_amount).toLocaleString() : '0'} RWF</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>VAT (18%)</Text>
                                <Text style={styles.summaryValue}>{sale.vat_amount ? Number(sale.vat_amount).toLocaleString() : '0'} RWF</Text>
                            </View>
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>{Number(sale.total).toLocaleString()} RWF</Text>
                            </View>
                            {sale.profit !== undefined && (
                                <View style={[styles.summaryRow, styles.profitRow]}>
                                    <Text style={[styles.profitLabel, sale.profit < 0 ? styles.textRed : styles.textGreen]}>
                                        {sale.profit < 0 ? 'Loss' : 'Profit'}
                                    </Text>
                                    <Text style={[styles.profitValue, sale.profit < 0 ? styles.textRed : styles.textGreen]}>
                                        {Math.abs(sale.profit).toLocaleString()} RWF
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        {sale.status !== 'REFUNDED' && (
                            <TouchableOpacity
                                style={styles.refundButton}
                                onPress={handleRefund}
                                disabled={processing}
                            >
                                {processing ? (
                                    <ActivityIndicator color="#DC2626" />
                                ) : (
                                    <>
                                        <Trash2 size={20} color="#DC2626" />
                                        <Text style={styles.refundText}>Refund</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.printButton}>
                            <Printer size={20} color="#FFFFFF" />
                            <Text style={styles.printText}>Print Receipt</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1d21',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        height: '90%',
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        marginTop: 2,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
    },
    body: {
        flex: 1,
        padding: 24,
    },
    statusGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        backgroundColor: '#2a2e34',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#D1D5DB',
    },
    statusCard: {
        flex: 1,
        backgroundColor: '#2a2e34',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusLabel: {
        fontSize: 10,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    bgGreen: { backgroundColor: '#DCFCE7' },
    bgOrange: { backgroundColor: '#FFEDD5' },
    bgRed: { backgroundColor: '#FEE2E2' },
    textGreen: { color: '#15803D' },
    textOrange: { color: '#C2410C' },
    textRed: { color: '#B91C1C' },
    statusText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    itemsTable: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    tableHeaderText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.03)',
    },
    tableCell: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        color: '#D1D5DB',
    },
    summarySection: {
        backgroundColor: '#2a2e34',
        padding: 20,
        borderRadius: 20,
        gap: 12,
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
    summaryValue: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: 12,
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    totalValue: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
    },
    profitRow: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        borderStyle: 'dashed',
        paddingTop: 12,
    },
    profitLabel: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
    },
    profitValue: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        flexDirection: 'row',
        gap: 12,
    },
    refundButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    refundText: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#DC2626',
    },
    printButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#111827',
        borderRadius: 16,
    },
    printText: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
});
