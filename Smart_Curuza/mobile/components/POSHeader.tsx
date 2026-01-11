import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function POSHeader() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.mainRow}>
                {/* Left: Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#0b0c0c" />
                </TouchableOpacity>

                {/* Middle: Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>New Sale</Text>
                    <Text style={styles.subtitle}>Process Transaction</Text>
                </View>

                {/* Right: Placeholder to balance layout (or could be a clear cart button later) */}
                <View style={styles.placeholder} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 48, // Status bar space
        paddingBottom: 28,
        backgroundColor: '#2a2e34', // Jet (Dark Theme)
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 10,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 48,
        height: 48,
        backgroundColor: '#fbe134', // Gold
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    titleSection: {
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        lineHeight: 24,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: 'rgba(255, 255, 255, 0.5)',
    },
    placeholder: {
        width: 48,
    },
});
