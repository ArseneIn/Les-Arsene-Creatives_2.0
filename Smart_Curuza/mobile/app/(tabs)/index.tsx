import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, View, Text, RefreshControl } from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardStats from '../../components/DashboardStats';
import ProductSalesChart from '../../components/ProductSalesChart';
import QuickActions from '../../components/QuickActions';
import RecentActivity, { RecentSale } from '../../components/RecentActivity';
import ScreenWrapper from '../../components/ScreenWrapper';

import CRMModule from '../../components/CRMModule';
import InventoryModule from '../../components/InventoryModule';
import ExpensesModule from '../../components/ExpensesModule';
import SkeletonLoader from '../../components/SkeletonLoader';
import ShiftManagerModal from '../../components/ShiftManagerModal';
import { ApiClient } from '../../lib/api_client';
import { useAuth } from '../../lib/auth/AuthContext';

type Period = 'today' | 'week' | 'month';

const TabSkeleton = () => (
    <View style={styles.skeletonContainer}>
        {/* Mock large summary card */}
        <SkeletonLoader height={140} borderRadius={24} style={{ marginBottom: 16 }} />
        
        {/* Mock smaller stat row */}
        <View style={styles.skeletonRow}>
            <SkeletonLoader width="48%" height={100} borderRadius={16} />
            <SkeletonLoader width="48%" height={100} borderRadius={16} />
        </View>

        {/* Mock search/command bar */}
        <SkeletonLoader height={54} borderRadius={16} style={{ marginTop: 24, marginBottom: 20 }} />

        {/* Mock list items */}
        <SkeletonLoader height={80} borderRadius={20} style={{ marginBottom: 12 }} />
        <SkeletonLoader height={80} borderRadius={20} style={{ marginBottom: 12 }} />
        <SkeletonLoader height={80} borderRadius={20} style={{ marginBottom: 12 }} />
    </View>
);

export default function Dashboard() {
    const [period, setPeriod] = useState<Period>('today');
    const [activeTab, setActiveTab] = useState('overview');
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // Overview Data State
    const [statsData, setStatsData] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentSale[]>([]);
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [requiresShift, setRequiresShift] = useState(false);
    const { user } = useAuth();

    const fetchOverviewData = useCallback(async (p: Period, bypassCache = false) => {
        // Only show skeleton if we don't have data yet or we are force-refreshing
        if (!statsData || bypassCache) {
            setLoadingOverview(true);
        }

        try {
            // Check shift status for Cashiers first
            if (user?.role === 'CASHIER' && bypassCache) {
                try {
                    const shift = await ApiClient.getCurrentShift(true);
                    if (!shift) setRequiresShift(true);
                } catch (e: any) {
                    if (e.message?.includes('404')) {
                        setRequiresShift(true);
                    }
                }
            }

            // Concurrent fetch: stats (includes topSellingProducts) + recent transactions
            const [stats, recent] = await Promise.all([
                ApiClient.getDashboardStats(p, bypassCache),
                ApiClient.getSalesHistory(5, bypassCache),
            ]);
            
            // Enhance stats with field aliases for DashboardStats component
            const enhancedStats = {
                ...stats,
                expenses: stats.todayExpenses,
                grossProfit: stats.todayGrossProfit,
            };

            // Build chart data from backend's topSellingProducts aggregate
            const topProducts: any[] = stats.topSellingProducts ?? [];
            const chartItems = topProducts.map((item: any) => ({
                name: item.name ?? 'Unknown',
                sales: Number(item.sold_quantity) || 0,
                amount: (
                    (Number(item.sold_quantity) || 0) * (Number(item.price) || 0)
                ).toLocaleString(),
            }));

            // Map recent sales to RecentSale shape
            const mappedRecent: RecentSale[] = recent.map((s: any) => ({
                id: s.id,
                total: Number(s.total) || 0,
                payment_method: s.payment_method ?? 'CASH',
                created_at: s.created_at,
                items_count: Array.isArray(s.items) ? s.items.length : undefined,
                customer: s.customer ?? null,
            }));

            setStatsData(enhancedStats);
            setChartData(chartItems);
            setRecentActivity(mappedRecent);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoadingOverview(false);
            setRefreshing(false);
        }
    }, []); // stable — no deps that change on re-render

    useFocusEffect(
        useCallback(() => {
            fetchOverviewData(period, true);
        }, [period, fetchOverviewData])
    );

    useEffect(() => {
        if (activeTab === 'overview') {
            fetchOverviewData(period);
        }
    }, [activeTab, period, fetchOverviewData]);

    const handleTabChange = (tabId: string) => {
        if (activeTab === tabId) return;
        
        if (tabId === 'overview') {
            setIsTransitioning(false);
        } else {
            setIsTransitioning(true);
            setTimeout(() => setIsTransitioning(false), 50);
        }
        
        setActiveTab(tabId);
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (activeTab === 'overview') {
            fetchOverviewData(period, true);
        }
    };

    return (
        <ScreenWrapper safeArea={false} backgroundImageStyle={styles.backgroundImage}>
            <DashboardHeader activeTab={activeTab} onTabChange={handleTabChange} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor="#fbe134"
                    />
                }
            >
                {isTransitioning ? (
                    <TabSkeleton />
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                <DashboardStats 
                                    period={period} 
                                    setPeriod={setPeriod} 
                                    data={statsData}
                                    loading={loadingOverview}
                                />
                                <ProductSalesChart 
                                    period={period} 
                                    data={chartData}
                                    loading={loadingOverview}
                                />
                                <QuickActions />
                                <RecentActivity 
                                    data={recentActivity}
                                    loading={loadingOverview}
                                />
                            </>
                        )}

                        {activeTab === 'crm' && <CRMModule />}
                        {activeTab === 'inventory' && <InventoryModule />}
                        {activeTab === 'expenses' && <ExpensesModule />}
                    </>
                )}
            </ScrollView>
            
            <ShiftManagerModal 
                visible={requiresShift} 
                onShiftOpened={() => setRequiresShift(false)} 
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        opacity: 1,
    },
    scrollView: {
        flex: 1,
        marginTop: 0,
    },
    scrollContent: {
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    skeletonContainer: {
        flex: 1,
        paddingTop: 10,
    },
    skeletonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
});
