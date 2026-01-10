import { View, ScrollView, ImageBackground } from 'react-native';
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
            className="flex-1 bg-platinum"
            imageStyle={{ opacity: 0.05, resizeMode: 'repeat' }}
        >
            <SafeAreaView className="flex-1">
                <StatusBar style="dark" />

                <DashboardHeader />

                <ScrollView className="flex-1 px-5 -mt-6 pt-10" contentContainerStyle={{ paddingBottom: 120 }}>
                    <DashboardStats />
                    <QuickActions />
                    <RecentActivity />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}
