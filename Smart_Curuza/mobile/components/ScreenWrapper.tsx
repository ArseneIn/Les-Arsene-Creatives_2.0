import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

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
    statusBarStyle = 'dark',
    safeArea = true
}: ScreenWrapperProps) {
    const Content = safeArea ? SafeAreaView : React.Fragment;
    const contentProps = safeArea ? { style: styles.safeArea } : {};

    return (
        <ImageBackground
            source={require('../assets/doodle-bg.png')}
            style={[styles.background, style]}
            imageStyle={[styles.backgroundImage, backgroundImageStyle]}
        >
            <StatusBar style={statusBarStyle} />
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
