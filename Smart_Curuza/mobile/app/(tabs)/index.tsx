import React from 'react';
import { View, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardStats from '../../components/DashboardStats';
import QuickActions from '../../components/QuickActions';
import RecentActivity from '../../components/RecentActivity';

export default function Dashboard() {
    return (
        <ImageBackground
            source={require('../../assets/doodle-bg.png')}
            style={styles.background}
            imageStyle={styles.backgroundImage}
        >
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="dark" />

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
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray fallback
    },
    backgroundImage: {
        // Removed opacity to make it visible like POS
        resizeMode: 'cover',
    },
    safeArea: {
        flex: 1,
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
