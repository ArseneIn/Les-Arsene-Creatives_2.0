import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth/AuthContext';
import { ApiClient } from '../lib/api_client';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!phone || !pin) {
            setError('Please enter both phone number and PIN');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await ApiClient.login({ phone, pin });
            await login(response.access_token, response.user);
            // Navigation is handled by AuthContext/Layout
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-8"
            >
                <View className="items-center mb-12">
                    <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-4">
                        <Text className="text-white text-3xl font-bold">SC</Text>
                    </View>
                    <Text className="text-3xl font-bold text-gray-900">Smart Curuza</Text>
                    <Text className="text-gray-500 mt-2">Sign in to your POS</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
                        <TextInput
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg"
                            placeholder="078..."
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2 font-medium">PIN</Text>
                        <TextInput
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg"
                            placeholder="••••"
                            secureTextEntry
                            keyboardType="numeric"
                            maxLength={4}
                            value={pin}
                            onChangeText={setPin}
                        />
                    </View>

                    {error ? (
                        <Text className="text-red-500 text-sm text-center">{error}</Text>
                    ) : null}

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={isLoading}
                        className={`w-full bg-blue-600 rounded-xl py-4 items-center mt-4 ${isLoading ? 'opacity-70' : ''}`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-lg font-bold">Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
