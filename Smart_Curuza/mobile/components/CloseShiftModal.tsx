import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Modal, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { ApiClient } from '../lib/api_client';
import { useTheme } from '../lib/theme/ThemeContext';
import { Banknote, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, LogOut } from 'lucide-react-native';

interface CloseShiftModalProps {
    visible: boolean;
    shiftId: string;
    /** If true, this was triggered by a logout attempt — show warning */
    fromLogout?: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CloseShiftModal({ visible, shiftId, fromLogout = false, onClose, onSuccess }: CloseShiftModalProps) {
    const { colors, isDarkMode } = useTheme();
    const [actualCash, setActualCash] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [shiftData, setShiftData] = useState<any>(null);
    const [loadingShift, setLoadingShift] = useState(true);

    // Fetch shift details when modal opens
    useEffect(() => {
        if (visible && shiftId) {
            setLoadingShift(true);
            setActualCash('');
            setNotes('');
            ApiClient.getCurrentShift(true)
                .then(shift => setShiftData(shift))
                .catch(() => setShiftData(null))
                .finally(() => setLoadingShift(false));
        }
    }, [visible, shiftId]);

    const enteredAmount = Number(actualCash.replace(/[^0-9]/g, '')) || 0;
    const expectedCash = shiftData ? Number(shiftData.expected_cash) : 0;
    const difference = enteredAmount - expectedCash;
    const hasEntered = actualCash.trim().length > 0;

    const varianceColor = !hasEntered
        ? colors.textSecondary
        : difference === 0
            ? '#10B981'
            : difference > 0 ? '#3B82F6' : '#EF4444';

    const varianceLabel = !hasEntered
        ? '—'
        : difference === 0
            ? 'Balanced ✓'
            : difference > 0
                ? `+${difference.toLocaleString()} RWF (Surplus)`
                : `${difference.toLocaleString()} RWF (Shortage)`;

    const handleCloseShift = async () => {
        if (!hasEntered || enteredAmount < 0) {
            Alert.alert('Invalid Amount', 'Please enter the actual cash in your drawer.');
            return;
        }

        // Warn if there is a large discrepancy (>5%)
        if (expectedCash > 0 && Math.abs(difference) > expectedCash * 0.05) {
            const action = await new Promise<boolean>(resolve => {
                Alert.alert(
                    difference < 0 ? '⚠️ Cash Shortage' : '💡 Cash Surplus',
                    `There is a ${Math.abs(difference).toLocaleString()} RWF ${difference < 0 ? 'shortage' : 'surplus'} compared to expected. Are you sure the amount is correct?`,
                    [
                        { text: 'Review Again', style: 'cancel', onPress: () => resolve(false) },
                        { text: 'Confirm Anyway', style: 'destructive', onPress: () => resolve(true) },
                    ]
                );
            });
            if (!action) return;
        }

        setLoading(true);
        try {
            await ApiClient.closeShift(shiftId, enteredAmount, notes);
            onSuccess();
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Could not close shift. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch { return '--:--'; }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
                <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {/* Drag indicator */}
                    <View style={[styles.dragBar, { backgroundColor: colors.border }]} />

                    {/* Header */}
                    {fromLogout && (
                        <View style={[styles.logoutBanner, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }]}>
                            <AlertTriangle size={16} color="#EF4444" />
                            <Text style={styles.bannerText}>You must close your shift before signing out.</Text>
                        </View>
                    )}

                    <View style={styles.titleRow}>
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(251,225,52,0.1)' }]}>
                            <LogOut size={22} color="#fbe134" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.title, { color: colors.textPrimary }]}>Close Shift</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Cash reconciliation required</Text>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
                        {loadingShift ? (
                            <ActivityIndicator color={colors.brandGold} style={{ marginVertical: 24 }} />
                        ) : (
                            <>
                                {/* Shift summary */}
                                {shiftData && (
                                    <View style={[styles.summaryCard, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                                        <View style={styles.summaryRow}>
                                            <View style={styles.summaryItem}>
                                                <Clock size={14} color={colors.textSecondary} />
                                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Started</Text>
                                                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                                                    {formatTime(shiftData.start_time)}
                                                </Text>
                                            </View>
                                            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                                            <View style={styles.summaryItem}>
                                                <Banknote size={14} color={colors.textSecondary} />
                                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Starting Cash</Text>
                                                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                                                    {Number(shiftData.starting_cash).toLocaleString()} RWF
                                                </Text>
                                            </View>
                                            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                                            <View style={styles.summaryItem}>
                                                <TrendingUp size={14} color="#10B981" />
                                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Cash Sales</Text>
                                                <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                                                    {(Number(shiftData.expected_cash) - Number(shiftData.starting_cash)).toLocaleString()} RWF
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Expected total */}
                                        <View style={[styles.expectedRow, { borderTopColor: colors.border }]}>
                                            <Text style={[styles.expectedLabel, { color: colors.textSecondary }]}>Expected in Drawer</Text>
                                            <Text style={[styles.expectedValue, { color: '#fbe134' }]}>
                                                {expectedCash.toLocaleString()} RWF
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Actual cash input */}
                                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Count & Enter Actual Cash (RWF)</Text>
                                <View style={[styles.inputGroup, { backgroundColor: colors.overlay, borderColor: hasEntered ? varianceColor : colors.border }]}>
                                    <Banknote size={20} color={hasEntered ? varianceColor : colors.textSecondary} style={{ marginRight: 12 }} />
                                    <TextInput
                                        style={[styles.input, { color: colors.textPrimary }]}
                                        placeholder="0"
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType="number-pad"
                                        value={actualCash}
                                        onChangeText={setActualCash}
                                        editable={!loading}
                                    />
                                </View>

                                {/* Variance display */}
                                <View style={[styles.varianceRow, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                                    {difference < 0 && hasEntered
                                        ? <TrendingDown size={16} color={varianceColor} />
                                        : difference > 0 && hasEntered
                                            ? <TrendingUp size={16} color={varianceColor} />
                                            : <CheckCircle2 size={16} color={varianceColor} />
                                    }
                                    <Text style={[styles.varianceLabel, { color: colors.textSecondary }]}>Variance:</Text>
                                    <Text style={[styles.varianceValue, { color: varianceColor }]}>{varianceLabel}</Text>
                                </View>

                                {/* Notes */}
                                <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 12 }]}>Notes (Optional)</Text>
                                <View style={[styles.notesGroup, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                                    <TextInput
                                        style={[styles.input, { color: colors.textPrimary }]}
                                        placeholder="Explain any discrepancies..."
                                        placeholderTextColor={colors.textSecondary}
                                        value={notes}
                                        onChangeText={setNotes}
                                        editable={!loading}
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>
                            </>
                        )}
                    </ScrollView>

                    {/* Footer buttons */}
                    <View style={[styles.footer, { borderTopColor: colors.border }]}>
                        <TouchableOpacity
                            style={[styles.cancelBtn, { borderColor: colors.border }]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmBtn, (!hasEntered || loading) && { opacity: 0.45 }]}
                            onPress={handleCloseShift}
                            disabled={!hasEntered || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#0b0c0c" />
                            ) : (
                                <Text style={styles.confirmBtnText}>Close & Sign Out</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
    sheet: {
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        borderWidth: 1, paddingBottom: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.15, shadowRadius: 16, elevation: 16,
    },
    dragBar: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
    logoutBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        marginHorizontal: 20, marginTop: 12, padding: 12,
        borderRadius: 12, borderWidth: 1,
    },
    bannerText: { flex: 1, fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#EF4444' },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16 },
    iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 18, fontFamily: 'Poppins_700Bold' },
    subtitle: { fontSize: 12, fontFamily: 'Montserrat_500Medium', marginTop: 1 },
    body: { paddingHorizontal: 20, paddingBottom: 8 },
    summaryCard: {
        borderRadius: 16, borderWidth: 1, marginBottom: 20, overflow: 'hidden',
    },
    summaryRow: { flexDirection: 'row' },
    summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 },
    summaryDivider: { width: 1 },
    summaryLabel: { fontSize: 10, fontFamily: 'Montserrat_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
    summaryValue: { fontSize: 13, fontFamily: 'Poppins_700Bold', textAlign: 'center' },
    expectedRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 12,
    },
    expectedLabel: { fontSize: 13, fontFamily: 'Montserrat_600SemiBold' },
    expectedValue: { fontSize: 18, fontFamily: 'Poppins_700Bold' },
    fieldLabel: { fontSize: 11, fontFamily: 'Montserrat_700Bold', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
    inputGroup: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 16, height: 54, marginBottom: 10,
    },
    input: { flex: 1, fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
    varianceRow: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 4,
    },
    varianceLabel: { fontSize: 13, fontFamily: 'Montserrat_500Medium' },
    varianceValue: { flex: 1, fontSize: 13, fontFamily: 'Montserrat_700Bold', textAlign: 'right' },
    notesGroup: {
        borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, minHeight: 60,
    },
    footer: {
        flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 14,
        paddingBottom: 20, borderTopWidth: 1, marginTop: 8,
    },
    cancelBtn: { flex: 1, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    cancelBtnText: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold' },
    confirmBtn: {
        flex: 2, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fbe134', shadowColor: '#fbe134', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    },
    confirmBtnText: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#0b0c0c' },
});
