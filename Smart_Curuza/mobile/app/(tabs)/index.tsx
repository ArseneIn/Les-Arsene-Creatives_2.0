import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardStats from '../../components/DashboardStats';
import ProductSalesChart from '../../components/ProductSalesChart';
import QuickActions from '../../components/QuickActions';
import RecentActivity from '../../components/RecentActivity';
import ScreenWrapper from '../../components/ScreenWrapper';

import CRMModule from '../../components/CRMModule';

type Period = 'today' | 'week' | 'month';

export default function Dashboard() {
    const [period, setPeriod] = React.useState<Period>('today');
    const [activeTab, setActiveTab] = React.useState('overview');

    return (
        <ScreenWrapper backgroundImageStyle={styles.backgroundImage}>
            <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'overview' && (
                    <>
                        <DashboardStats period={period} setPeriod={setPeriod} />
                        <ProductSalesChart period={period} />
                        <QuickActions />
                        <RecentActivity />
                    </>
                )}

                {activeTab === 'crm' && (
                    <CRMModule />
                )}

                {/* Placeholders for future nav expansions */}
                {activeTab === 'inventory' && (
                     <View style={{padding: 24, alignItems: 'center'}}><Text style={{color: '#fff'}}>Inventory Module Content</Text></View>
                )}
                 {activeTab === 'expenses' && (
                     <View style={{padding: 24, alignItems: 'center'}}><Text style={{color: '#fff'}}>Expenses Module Content</Text></View>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        // Override opacity if needed, or keep default
        opacity: 1,
    },
    scrollView: {
        flex: 1,
        marginTop: -32, // More overlap for the curved effect
        paddingTop: 48, // More padding to clear the taller header
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120, // Space for tab bar
    },
});
