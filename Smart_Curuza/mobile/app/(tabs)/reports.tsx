import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function Reports() {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>Reports Screen</Text>
                <Text style={styles.subtitle}>Coming Soon</Text>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
});
