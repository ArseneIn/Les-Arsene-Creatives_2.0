import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { X, Calendar, Download } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ApiClient } from '../lib/api_client';

interface ExportSalesModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ExportSalesModal({ visible, onClose }: ExportSalesModalProps) {
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await ApiClient.getSalesExport(period);
            const data = response.details;

            // Convert to CSV
            const headers = ['Transaction ID', 'Date', 'Customer', 'Items', 'Total (RWF)', 'Cost (RWF)', 'Profit (RWF)', 'VAT (RWF)', 'Payment Method', 'Status'];
            const csvContent = [
                headers.join(','),
                ...data.map((row: any) => [
                    `"${row.id}"`,
                    `"${new Date(row.date).toLocaleString()}"`,
                    `"${row.customer}"`,
                    `"${row.items}"`,
                    row.total,
                    row.cost,
                    row.profit,
                    row.vat,
                    `"${row.paymentMethod}"`,
                    `"${row.status}"`
                ].join(','))
            ].join('\n');

            // Save and Share
            const fileName = `sales_detailed_${period}_${new Date().toISOString().split('T')[0]}.csv`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, csvContent, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert("Success", "File saved to documents");
            }

            onClose();
        } catch (error) {
            console.error('Export failed:', error);
            Alert.alert("Error", "Failed to export data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Export Sales Report</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.description}>Select the time period for your sales report:</Text>

                        <View style={styles.optionsGrid}>
                            {(['weekly', 'monthly', 'yearly'] as const).map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.optionCard,
                                        period === opt && styles.selectedOption
                                    ]}
                                    onPress={() => setPeriod(opt)}
                                >
                                    <View style={[
                                        styles.iconBox,
                                        period === opt ? styles.bgGold : styles.bgGray
                                    ]}>
                                        <Calendar size={24} color={period === opt ? '#0b0c0c' : '#6B7280'} />
                                    </View>
                                    <Text style={[
                                        styles.optionLabel,
                                        period === opt && styles.selectedText
                                    ]}>
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleExport}
                            style={styles.exportButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#0b0c0c" />
                            ) : (
                                <>
                                    <Download size={20} color="#0b0c0c" />
                                    <Text style={styles.exportText}>Export CSV</Text>
                                </>
                            )}
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
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    body: {
        padding: 24,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#4B5563',
        marginBottom: 24,
    },
    optionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    optionCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        gap: 12,
    },
    selectedOption: {
        borderColor: '#fbe134',
        backgroundColor: 'rgba(251, 225, 52, 0.05)',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgGray: { backgroundColor: '#F3F4F6' },
    bgGold: { backgroundColor: '#fbe134' },
    optionLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    selectedText: {
        color: '#111827',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    cancelText: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fbe134',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    exportText: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#0b0c0c',
    },
});
