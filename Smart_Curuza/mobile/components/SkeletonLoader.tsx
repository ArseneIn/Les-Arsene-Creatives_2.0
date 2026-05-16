import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../lib/theme/ThemeContext';

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    circle?: boolean;
}

export default function SkeletonLoader({ 
    width = '100%', 
    height = 20, 
    borderRadius = 8, 
    style,
    circle = false
}: SkeletonLoaderProps) {
    const { isDarkMode } = useTheme();
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.8,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, [pulseAnim]);

    const baseColor = isDarkMode ? '#2a2e34' : '#E5E7EB';

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height: height as any,
                    borderRadius: circle ? (typeof height === 'number' ? height / 2 : 50) : borderRadius,
                    backgroundColor: baseColor,
                    opacity: pulseAnim,
                },
                style,
            ]}
        />
    );
}
