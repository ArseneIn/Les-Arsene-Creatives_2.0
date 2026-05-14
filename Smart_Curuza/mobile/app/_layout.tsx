import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';


import { AuthProvider } from '../lib/auth/AuthContext';
import { ThemeProvider } from '../lib/theme/ThemeContext';
import { SyncProvider } from '../lib/sync/SyncContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OfflineBanner from '../components/OfflineBanner';
import GlobalApprovalModal from '../components/GlobalApprovalModal';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Poppins_600SemiBold,
        Poppins_700Bold,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SyncProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <OfflineBanner />
                        <GlobalApprovalModal />
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="login" />
                            <Stack.Screen name="register" />
                            <Stack.Screen name="sales/index" />
                        </Stack>
                    </ThemeProvider>
                </AuthProvider>
            </SyncProvider>
        </SafeAreaProvider>
    );
}
