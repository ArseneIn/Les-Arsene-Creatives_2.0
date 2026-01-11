import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth/AuthContext';
import { ApiClient } from '../lib/api_client';
import { Smartphone, Lock, Eye, EyeOff, LogIn, WifiOff, Mail } from 'lucide-react-native';
import ScreenWrapper from '../components/ScreenWrapper';

type LoginMethod = 'phone' | 'email';

export default function LoginScreen() {
    const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');

    // Phone/PIN state
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');

    // Email/Password state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPin, setShowPin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        setError('');

        if (loginMethod === 'phone') {
            if (!phone || !pin) {
                setError('Please enter both phone number and PIN');
                return;
            }
        } else {
            if (!email || !password) {
                setError('Please enter both email and password');
                return;
            }
        }

        setIsLoading(true);

        try {
            const credentials = loginMethod === 'phone'
                ? { phone, pin }
                : { email, password };

            const response = await ApiClient.login(credentials);
            await login(response.access_token, response.user);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Main Card */}
                    <View style={styles.card}>

                        {/* Header Section */}
                        <View style={styles.header}>
                            <Text style={styles.brandTitle}>Smart-Curuza</Text>
                            <Text style={styles.brandSubtitle}>MERCHANT PORTAL</Text>
                        </View>

                        {/* Welcome Section */}
                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeTitle}>Welcome Back</Text>
                            <Text style={styles.welcomeSubtitle}>Please enter your credentials to access your store.</Text>
                        </View>

                        {/* Login Method Toggle */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleButton, loginMethod === 'phone' && styles.toggleButtonActive]}
                                onPress={() => {
                                    setLoginMethod('phone');
                                    setError('');
                                }}
                            >
                                <Text style={[styles.toggleText, loginMethod === 'phone' && styles.toggleTextActive]}>Phone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleButton, loginMethod === 'email' && styles.toggleButtonActive]}
                                onPress={() => {
                                    setLoginMethod('email');
                                    setError('');
                                }}
                            >
                                <Text style={[styles.toggleText, loginMethod === 'email' && styles.toggleTextActive]}>Email</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formSection}>

                            {loginMethod === 'phone' ? (
                                <>
                                    {/* Phone Input */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>PHONE NUMBER</Text>
                                        <View style={styles.inputWrapper}>
                                            <View style={styles.iconLeft}>
                                                <Smartphone size={20} color="#9CA3AF" />
                                            </View>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="078X XXX XXX"
                                                keyboardType="phone-pad"
                                                value={phone}
                                                onChangeText={setPhone}
                                                autoCapitalize="none"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                    </View>

                                    {/* PIN Input */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>4-DIGIT PIN</Text>
                                        <View style={styles.inputWrapper}>
                                            <View style={styles.iconLeft}>
                                                <Lock size={20} color="#9CA3AF" />
                                            </View>
                                            <TextInput
                                                style={[styles.input, styles.pinInput]}
                                                placeholder="••••"
                                                secureTextEntry={!showPin}
                                                keyboardType="numeric"
                                                maxLength={4}
                                                value={pin}
                                                onChangeText={setPin}
                                                placeholderTextColor="#9CA3AF"
                                            />
                                            <TouchableOpacity
                                                style={styles.iconRight}
                                                onPress={() => setShowPin(!showPin)}
                                            >
                                                {showPin ? (
                                                    <EyeOff size={20} color="#9CA3AF" />
                                                ) : (
                                                    <Eye size={20} color="#9CA3AF" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            ) : (
                                <>
                                    {/* Email Input */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>EMAIL ADDRESS</Text>
                                        <View style={styles.inputWrapper}>
                                            <View style={styles.iconLeft}>
                                                <Mail size={20} color="#9CA3AF" />
                                            </View>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="merchant@smartcuruza.com"
                                                keyboardType="email-address"
                                                value={email}
                                                onChangeText={setEmail}
                                                autoCapitalize="none"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                    </View>

                                    {/* Password Input */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>PASSWORD</Text>
                                        <View style={styles.inputWrapper}>
                                            <View style={styles.iconLeft}>
                                                <Lock size={20} color="#9CA3AF" />
                                            </View>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="••••••••"
                                                secureTextEntry={!showPassword}
                                                value={password}
                                                onChangeText={setPassword}
                                                placeholderTextColor="#9CA3AF"
                                            />
                                            <TouchableOpacity
                                                style={styles.iconRight}
                                                onPress={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} color="#9CA3AF" />
                                                ) : (
                                                    <Eye size={20} color="#9CA3AF" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            )}

                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={isLoading}
                                style={[styles.button, isLoading && styles.buttonDisabled]}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#0b0c0c" />
                                ) : (
                                    <View style={styles.buttonContent}>
                                        <LogIn size={20} color="#0b0c0c" />
                                        <Text style={styles.buttonText}>Login</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.forgotButton}>
                                <Text style={styles.forgotText}>
                                    {loginMethod === 'phone' ? 'Forgot your PIN?' : 'Forgot your Password?'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <WifiOff size={14} color="#9CA3AF" style={{ marginRight: 4 }} />
                        <Text style={styles.footerText}>Offline-first enabled for Rwanda merchants</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#e9eaec', // platinum
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        backgroundColor: '#1e1e1e', // Dark header background
        borderRadius: 16,
        paddingVertical: 32,
        alignItems: 'center',
        marginBottom: 32,
    },
    brandTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 30,
        color: '#fbe134', // Primary Gold
        letterSpacing: -0.5,
    },
    brandSubtitle: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 4,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    welcomeSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    welcomeTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#0b0c0c', // Onyx
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14,
        color: '#6B7280', // Neutral-500
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        width: '100%',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: '#6B7280',
    },
    toggleTextActive: {
        color: '#0b0c0c',
        fontFamily: 'Montserrat_600SemiBold',
    },
    formSection: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 12,
        color: '#6B7280', // Neutral-500
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#F3F4F6', // Neutral-100
        borderRadius: 12,
        paddingVertical: 16,
        paddingLeft: 48, // Space for left icon
        paddingRight: 16,
        fontSize: 16,
        color: '#0b0c0c',
        fontFamily: 'Montserrat_400Regular',
    },
    pinInput: {
        fontFamily: 'Montserrat_700Bold',
        letterSpacing: 8, // Tracking for PIN
    },
    iconLeft: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    iconRight: {
        position: 'absolute',
        right: 16,
        zIndex: 1,
        padding: 4,
    },
    errorText: {
        fontFamily: 'Montserrat_400Regular',
        color: '#EF4444',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#fbe134', // Primary Gold
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#0b0c0c',
        marginLeft: 8,
    },
    forgotButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotText: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        opacity: 0.7,
    },
    footerText: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 12,
        color: '#9CA3AF', // Neutral-400
    },
});
