import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

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
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: false, // backgroundColor interpolation needs false
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: false,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, [pulseAnim]);

    const interpolatedColor = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#2a2e34', '#4B5563'] // Solid Jet to Solid Slate (No transparency)
    });

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height: height as any,
                    borderRadius: circle ? (typeof height === 'number' ? height / 2 : 50) : borderRadius,
                    backgroundColor: interpolatedColor, // Solid color
                    // opacity removed to prevent transparency bleeding
                },
                style,
            ]}
        />
    );
}
