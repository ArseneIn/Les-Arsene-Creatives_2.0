import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSync } from '../lib/sync/SyncContext';

export default function OfflineBanner() {
    const { isOffline, isSyncing, syncProgress, queueLength } = useSync();
    const insets = useSafeAreaInsets();

    if (!isOffline && !isSyncing) return null;

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
            {isOffline ? (
                <View style={[styles.banner, styles.offline]}>
                    <WifiOff size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.text}>
                        You are offline. Changes will be saved locally.
                    </Text>
                </View>
            ) : isSyncing ? (
                <View style={[styles.banner, styles.syncing]}>
                    <RefreshCw size={16} color="#0B0C0C" style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.text, { color: '#0B0C0C' }]}>
                            Syncing data... {syncProgress}%
                        </Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${syncProgress}%` }]} />
                        </View>
                    </View>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: 'transparent',
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    offline: {
        backgroundColor: '#EF4444', // Red-500
    },
    syncing: {
        backgroundColor: '#FBE134', // Gold
    },
    text: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 13,
        color: '#FFFFFF',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2,
        marginTop: 6,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0B0C0C',
        borderRadius: 2,
    }
});
