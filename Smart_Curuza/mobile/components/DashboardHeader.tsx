import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Globe } from 'lucide-react-native';

export default function DashboardHeader() {
    return (
        <View style={styles.container}>
            <View style={styles.mainRow}>
                {/* Left: Avatar */}
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>SC</Text>
                    {/* Online Dot on Avatar */}
                    <View style={styles.onlineBadge} />
                </View>

                {/* Middle: Info Stack */}
                <View style={styles.infoSection}>
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.shopName}>Smart Shop</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Online Store</Text>
                    </View>
                </View>

                {/* Right: Language Switcher */}
                <TouchableOpacity style={styles.langButton}>
                    <Globe size={18} color="#fbe134" />
                    <Text style={styles.langText}>EN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 20,
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
    },
    avatar: {
        width: 56,
        height: 56,
        backgroundColor: '#fbe134', // gold
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        marginRight: 16,
        position: 'relative',
    },
    avatarText: {
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c', // onyx
        fontSize: 22,
    },
    onlineBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 12,
        height: 12,
        backgroundColor: '#22C55E', // green-500
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#2a2e34', // Match bg to create cutout effect
    },
    infoSection: {
        flex: 1, // Take up remaining space
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 2,
    },
    shopName: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        lineHeight: 24,
        marginBottom: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        backgroundColor: '#4ade80', // green-400
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#4ade80', // green-400
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    langText: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
    },
});
