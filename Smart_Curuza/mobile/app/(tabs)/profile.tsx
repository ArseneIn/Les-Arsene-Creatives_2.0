import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    return (
        <SafeAreaView className="flex-1 bg-platinum items-center justify-center">
            <Text className="font-heading text-xl text-onyx">Profile Screen</Text>
            <Text className="text-gray-400">Coming Soon</Text>
        </SafeAreaView>
    );
}
