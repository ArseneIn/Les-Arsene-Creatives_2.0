import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Search, DollarSign, ArrowUpRight, Plus, Calendar } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';
import SkeletonLoader from './SkeletonLoader';

interface ExpenseRecord {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
}

const ExpensesSkeleton = () => (
    <View style={{ gap: 16 }}>
        <SkeletonLoader height={140} borderRadius={24} style={{ marginBottom: 16 }} />
        <View style={styles.actionsBar}>
            <SkeletonLoader width="48%" height={50} borderRadius={14} />
            <SkeletonLoader width="48%" height={50} borderRadius={14} />
        </View>
        <SkeletonLoader height={54} borderRadius={16} style={{ marginBottom: 20 }} />
        {[1, 2, 3].map(k => (
            <SkeletonLoader key={k} height={80} borderRadius={20} style={{ marginBottom: 12 }} />
        ))}
    </View>
);

export default function ExpensesModule() {
    const [searchQuery, setSearchQuery] = useState('');

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
        <View style={styles.expenseCard}>
            <View style={styles.cardHeader}>
                <View style={styles.iconRow}>
                    <View style={styles.iconBox}>
                        <ArrowUpRight size={20} color="#EF4444" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text>
                        <Text style={styles.itemCategory}>{item.category} • {item.date}</Text>
                    </View>
                </View>
                
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>{item.amount.toLocaleString()} <Text style={styles.currency}>RWF</Text></Text>
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
                        <View style={styles.summaryCardMain}>
                            <Text style={styles.summaryLabel}>Total Expenses (This Month)</Text>
                            <Text style={styles.summaryValueMain}>{totalExpenses.toLocaleString()} <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.5)'}}>RWF</Text></Text>
                        </View>
                    </View>

                    {/* Actions Bar */}
                    <View style={styles.actionsBar}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Plus size={16} color="#FFFFFF" />
                            <Text style={styles.actionButtonText}>Log Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButtonLight}>
                            <Calendar size={16} color="#6B7280" />
                            <Text style={styles.actionButtonLightText}>Filter by Date</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Command Bar */}
                    <View style={styles.commandBar}>
                        <View style={styles.searchBox}>
                            <Search size={18} color="#6B7280" />
                            <TextInput 
                                style={styles.searchInput}
                                placeholder="Search expenses..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    <FlatList 
                        data={filteredExpenses}
                        renderItem={renderExpenseCard}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />}
                        ListEmptyComponent={
                            <View style={styles.emptyStateContainer}>
                                <DollarSign size={32} color="#9CA3AF" />
                                <Text style={styles.emptyStateTitle}>No Expenses Found</Text>
                                <Text style={styles.emptyStateDesc}>Try adjusting your search criteria.</Text>
                            </View>
                        }
                    />
                </>
            )}
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
    actionsBar: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    actionButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 14, gap: 8,
    },
    actionButtonText: { fontSize: 13, fontFamily: 'Poppins_700Bold', color: '#FFFFFF' },
    actionButtonLight: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 14, gap: 8, borderWidth: 1, borderColor: '#E5E7EB'
    },
    actionButtonLightText: { fontSize: 13, fontFamily: 'Poppins_700Bold', color: '#4B5563' },
    commandBar: { flexDirection: 'row', marginBottom: 20 },
    searchBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f3f4f6', paddingHorizontal: 16, height: 54, borderRadius: 16, borderTopWidth: 3, borderTopColor: '#fbe134',
    },
    searchInput: { flex: 1, marginLeft: 12, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: '#2a2e34' },
    listContent: { paddingBottom: 20, gap: 12 },
    expenseCard: {
        backgroundColor: '#f3f4f6', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
    iconBox: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    itemDesc: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#111827', marginBottom: 2 },
    itemCategory: { fontSize: 11, fontFamily: 'Montserrat_600SemiBold', color: '#6B7280' },
    amountContainer: { alignItems: 'flex-end', marginLeft: 8 },
    amountText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#EF4444' },
    currency: { fontSize: 10, fontFamily: 'Montserrat_600SemiBold', color: '#9CA3AF' },
    emptyStateContainer: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#f3f4f6', borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
    emptyStateTitle: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#111827', marginTop: 12, marginBottom: 8 },
    emptyStateDesc: { fontSize: 12, fontFamily: 'Montserrat_500Medium', color: '#6B7280', textAlign: 'center' },
});
