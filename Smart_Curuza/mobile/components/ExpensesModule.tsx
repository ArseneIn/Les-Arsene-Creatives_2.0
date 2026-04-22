import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Search, DollarSign, ArrowUpRight, Plus, Calendar } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';
import SkeletonLoader from './SkeletonLoader';
import { useTheme } from '../lib/theme/ThemeContext';

import AddExpenseModal from './AddExpenseModal';

interface ExpenseRecord {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
}

const ExpensesSkeleton = () => {
    const { colors } = useTheme();
    return (
        <View style={{ gap: 16 }}>
            <SkeletonLoader height={140} borderRadius={24} style={{ marginBottom: 16 }} />
            <View style={styles.actionRow}>
                <SkeletonLoader width="85%" height={50} borderRadius={14} />
                <SkeletonLoader width={50} height={50} borderRadius={14} />
            </View>
            <SkeletonLoader height={54} borderRadius={16} style={{ marginBottom: 20 }} />
            {[1, 2, 3].map(k => (
                <SkeletonLoader key={k} height={80} borderRadius={20} style={{ marginBottom: 12 }} />
            ))}
        </View>
    );
};

export default function ExpensesModule() {
    const { colors, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddExpense, setShowAddExpense] = useState(false);

    const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchExpenses = async (bypassCache = false) => {
        // IMPROVED: Check cache synchronously to avoid skeleton flash
        const cachedData = ApiClient.getCached('/expenses');
        if ((!expenses.length && !cachedData) || bypassCache) {
            setLoading(true);
        }
        try {
            const data = await ApiClient.getExpenses(undefined, undefined, bypassCache);
            // Data mapping to UI interface
            const formatted = data.map((e: any) => ({
                id: e.id,
                description: e.description,
                category: e.category,
                amount: e.amount !== undefined ? parseFloat(e.amount) : 0,
                // Taking just the date portion correctly if available
                date: e.date ? e.date.substring(0, 10) : new Date(e.created_at).toISOString().substring(0, 10)
            })) as ExpenseRecord[];
            setExpenses(formatted);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchExpenses(true);
    }, [expenses]);

    const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);

    const filteredExpenses = expenses.filter(e => 
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderExpenseCard = ({ item }: { item: ExpenseRecord }) => (
        <View style={[styles.expenseCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: isDarkMode ? '#000': '#E5E7EB' }]}>
            <View style={styles.cardHeader}>
                <View style={styles.iconRow}>
                    <View style={[styles.iconBox, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                        <ArrowUpRight size={20} color={colors.danger} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.itemDesc, { color: colors.textPrimary }]} numberOfLines={1}>{item.description}</Text>
                        <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>{item.category} • {item.date}</Text>
                    </View>
                </View>
                
                <View style={styles.amountContainer}>
                    <Text style={[styles.amountText, { color: colors.danger }]}>{item.amount.toLocaleString()} <Text style={[styles.currency, { color: colors.textSecondary }]}>RWF</Text></Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ExpensesSkeleton />
            ) : (
                <>
                    {/* Macro Summary */}
                    <View style={styles.summaryContainer}>
                        <View style={[styles.summaryCardMain, { backgroundColor: colors.card, borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : colors.border }]}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Expenses (This Month)</Text>
                            <Text style={[styles.summaryValueMain, { color: colors.danger }]}>{totalExpenses.toLocaleString()} <Text style={{fontSize: 14, color: colors.textSecondary}}>RWF</Text></Text>
                        </View>
                    </View>

                    {/* Actions Bar */}
                    <View style={styles.actionRow}>
                <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Search size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search Expenses..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity 
                    style={[styles.addIconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => setShowAddExpense(true)}
                    activeOpacity={0.7}
                >
                    <Plus size={24} color={colors.danger} />
                </TouchableOpacity>
            </View>

                    <FlatList 
                        data={filteredExpenses}
                        renderItem={renderExpenseCard}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.danger} />}
                        ListEmptyComponent={
                            <View style={[styles.emptyStateContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <DollarSign size={32} color={colors.textSecondary} />
                                <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>No Expenses Found</Text>
                                <Text style={[styles.emptyStateDesc, { color: colors.textSecondary }]}>Try adjusting your search criteria.</Text>
                            </View>
                        }
                    />
                </>
            )}

            <AddExpenseModal 
                visible={showAddExpense}
                onClose={() => setShowAddExpense(false)}
                onSuccess={fetchExpenses}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    summaryContainer: { marginBottom: 16 },
    summaryCardMain: {
        backgroundColor: '#2a2e34',
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.15)', // Reduced red hint
    },
    summaryLabel: { fontSize: 12, fontFamily: 'Montserrat_700Bold', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    summaryValueMain: { fontSize: 32, fontFamily: 'Poppins_700Bold', color: '#EF4444' }, // Red for expenses
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2e34', 
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    addIconButton: {
        width: 52,
        height: 52,
        backgroundColor: '#2a2e34', 
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    listContent: { paddingBottom: 20, gap: 12 },
    expenseCard: {
        backgroundColor: '#1a1d21', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
    iconBox: { width: 44, height: 44, backgroundColor: '#2a2e34', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    itemDesc: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#FFFFFF', marginBottom: 2 },
    itemCategory: { fontSize: 11, fontFamily: 'Montserrat_600SemiBold', color: '#9CA3AF' },
    amountContainer: { alignItems: 'flex-end', marginLeft: 8 },
    amountText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#EF4444' },
    currency: { fontSize: 10, fontFamily: 'Montserrat_600SemiBold', color: '#9CA3AF' },
    emptyStateContainer: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#1a1d21', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' },
    emptyStateTitle: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFFFFF', marginTop: 12, marginBottom: 8 },
    emptyStateDesc: { fontSize: 12, fontFamily: 'Montserrat_500Medium', color: '#9CA3AF', textAlign: 'center' },
});
