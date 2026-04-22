import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '../lib/theme/ThemeContext';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    backgroundImageStyle?: ImageStyle;
    statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
    safeArea?: boolean;
}

export default function ScreenWrapper({
    children,
    style,
    backgroundImageStyle,
    statusBarStyle,
    safeArea = true
}: ScreenWrapperProps) {
    const { isDarkMode: dark } = useTheme();
    const Content = safeArea ? SafeAreaView : React.Fragment;
    
    // Choose theme values
    const backgroundSource = dark 
        ? require('../assets/doodle-bg-dark.png')
        : require('../assets/doodle-bg.png');
    
    const fallbackColor = dark ? '#1a1d21' : '#F9FAFB';
    const activeStatusBarStyle = statusBarStyle || (dark ? 'light' : 'dark');

    return (
        <ImageBackground
            source={backgroundSource}
            style={[styles.background, { backgroundColor: fallbackColor }, style]}
            imageStyle={[styles.backgroundImage, { opacity: dark ? 0.3 : 0.4 }, backgroundImageStyle]}
        >
            <StatusBar style={activeStatusBarStyle} />
            {safeArea ? (
                <SafeAreaView style={styles.safeArea}>
                    {children}
                </SafeAreaView>
            ) : (
                children
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray fallback
    },
    backgroundImage: {
        resizeMode: 'cover',
        opacity: 0.4, // Adjust opacity as needed for readability
    },
    safeArea: {
        flex: 1,
    },
});
