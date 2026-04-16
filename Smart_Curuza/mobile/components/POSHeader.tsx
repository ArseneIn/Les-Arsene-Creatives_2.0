import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function POSHeader() {
    const router = useRouter();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainRow}>
                <View style={styles.leftSection}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <ArrowLeft size={22} color="#fbe134" />
                    </TouchableOpacity>

                    <View style={styles.titleSection}>
                        <Text style={styles.title}>New Sale</Text>
                        <Text style={styles.subtitle}>Process Transaction</Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    {/* Placeholder for future icon, e.g. barcode scanner */}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 56, // Slightly more top padding for safe area
        paddingBottom: 20,
        backgroundColor: '#1a1d21', // Match exact background of sales page
        zIndex: 10,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle dark pill
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    titleSection: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF', // Softer grey
    },
    rightSection: {
        // Space for future "Scan Barcode" or actions
    },
});

