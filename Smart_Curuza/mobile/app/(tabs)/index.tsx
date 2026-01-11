import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardStats from '../../components/DashboardStats';
import QuickActions from '../../components/QuickActions';
import RecentActivity from '../../components/RecentActivity';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function Dashboard() {
    return (
        <ScreenWrapper backgroundImageStyle={styles.backgroundImage}>
            <DashboardHeader />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <DashboardStats />
                <QuickActions />
                <RecentActivity />
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
        marginTop: -24, // Overlap with header
        paddingTop: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120, // Space for tab bar
    },
});
