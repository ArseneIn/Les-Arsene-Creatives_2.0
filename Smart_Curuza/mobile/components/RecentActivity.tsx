import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { History, Banknote, Smartphone, FileText } from 'lucide-react-native';
import SkeletonLoader from './SkeletonLoader';
import { useTheme } from '../lib/theme/ThemeContext';

export interface RecentSale {
    id: string;
    total: number;
    payment_method: string;
    created_at: string;
    items_count?: number;
    customer?: { name?: string } | null;
}

interface RecentActivityProps {
    data: RecentSale[];
    loading: boolean;
    onShowMore?: () => void;
}

/** Returns an icon + colour pair based on payment method */
function paymentIcon(method: string) {
    const m = (method ?? '').toUpperCase();
    if (m === 'MOBILE_MONEY' || m === 'MOMO') {
        return { Icon: Smartphone, color: '#3B82F6' }; // Blue
    }
    if (m === 'CREDIT' || m === 'IDENI') {
        return { Icon: FileText, color: '#EF4444' }; // Red
    }
    return { Icon: Banknote, color: '#10B981' }; // Green (Cash)
}

/** Human-readable relative time (e.g. "5m ago") */
function timeAgo(dateStr: string): string {
    const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const SKELETON_COUNT = 3;

export default function RecentActivity({ data, loading, onShowMore }: RecentActivityProps) {
    const { colors, isDarkMode } = useTheme();

    // ── Loading skeleton ────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.textSecondary }]}>Recent Activity</Text>
                </View>
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <View key={i} style={{ marginBottom: 12 }}>
                        <SkeletonLoader height={74} borderRadius={24} />
                    </View>
                ))}
            </View>
        );
    }

    // ── Empty state ─────────────────────────────────────────────────────────
    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.textSecondary }]}>Recent Activity</Text>
                </View>
                <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <History size={28} color={colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet today</Text>
                </View>
            </View>
        );
    }

    // ── Real data ──────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textSecondary }]}>Recent Activity</Text>
                {onShowMore && (
                    <TouchableOpacity onPress={onShowMore} activeOpacity={0.7}>
                        <Text style={[styles.showMore, { color: colors.brandGold }]}>Show More</Text>
                    </TouchableOpacity>
                )}
            </View>

            {data.slice(0, 5).map(sale => {
                const { Icon, color } = paymentIcon(sale.payment_method);
                const label = sale.customer?.name
                    ? sale.customer.name
                    : sale.payment_method === 'CREDIT'
                    ? 'Credit Sale'
                    : 'Walk-in';
                const itemsLabel =
                    sale.items_count != null
                        ? `${sale.items_count} item${sale.items_count !== 1 ? 's' : ''}`
                        : '';
                const method =
                    sale.payment_method === 'MOBILE_MONEY'
                        ? 'MoMo'
                        : sale.payment_method === 'CREDIT'
                        ? 'Debt'
                        : 'Cash';

                return (
                    <View key={sale.id} style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: isDarkMode ? '#000': '#E5E7EB' }]}>
                        <View style={styles.activityLeft}>
                            <View style={[styles.iconBox, { backgroundColor: `${color}18` }]}>
                                <Icon size={20} color={color} />
                            </View>
                            <View>
                                <Text style={[styles.saleId, { color: colors.textPrimary }]} numberOfLines={1}>{label}</Text>
                                <Text style={[styles.saleDetails, { color: colors.textSecondary }]}>
                                    {timeAgo(sale.created_at)}
                                    {itemsLabel ? ` • ${itemsLabel}` : ''}
                                    {` • ${method}`}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.amount, { color: sale.payment_method === 'CREDIT' ? colors.danger : colors.brandGreen }]}>
                            {sale.payment_method === 'CREDIT' ? '' : '+'}{Number(sale.total).toLocaleString()} RWF
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    showMore: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#fbe134',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activityCard: {
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        marginBottom: 12,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saleId: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
        maxWidth: 180,
    },
    saleDetails: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        marginTop: 2,
    },
    amount: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#10B981',
        letterSpacing: 0.5,
    },
    emptyCard: {
        borderRadius: 24,
        paddingVertical: 32,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    emptyText: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
    },
});
