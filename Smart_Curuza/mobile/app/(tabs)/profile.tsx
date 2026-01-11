import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/auth/AuthContext';

export default function Profile() {
    const { logout, user } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.role}>{user?.role || 'Merchant'}</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // platinum/gray-100
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FBE134', // gold
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0B0C0C', // onyx
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
        color: '#6B7280',
    },
    content: {
        padding: 24,
    },
    logoutButton: {
        backgroundColor: '#EF4444', // red-500
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
