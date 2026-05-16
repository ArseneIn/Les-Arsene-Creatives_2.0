import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth/AuthContext';
import { ApiClient } from '../lib/api_client';
import { Smartphone, Lock, Eye, EyeOff, LogIn, WifiOff, Mail, Clock, Key } from 'lucide-react-native';
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

    const [approvalRequest, setApprovalRequest] = useState<any>(null);
    const [overridePin, setOverridePin] = useState('');
    const [showOverride, setShowOverride] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);

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
            
            if (response.status === 'REQUIRES_APPROVAL') {
                setApprovalRequest(response);
                setTimeLeft(300);
            } else {
                // Ensure we don't call login multiple times if it's already successful
                if (response.access_token) {
                    await login(response.access_token, response.user);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (approvalRequest && !showOverride) {
            interval = setInterval(async () => {
                try {
                    const status = await ApiClient.checkLoginStatus(approvalRequest.loginRequestId);
                    if (status.access_token) {
                        clearInterval(interval);
                        await login(status.access_token, status.user);
                    }
                } catch (err: any) {
                    clearInterval(interval);
                    setApprovalRequest(null);
                    setError(err.message || 'Login request denied or expired.');
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [approvalRequest, showOverride]);

    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (approvalRequest && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && approvalRequest) {
            setApprovalRequest(null);
            setError('Login request expired.');
        }
        return () => clearInterval(timer);
    }, [approvalRequest, timeLeft]);

    const handleOverride = async () => {
        if (!overridePin) return;
        setIsLoading(true);
        setError('');
        try {
            const response = await ApiClient.overrideLogin(approvalRequest.loginRequestId, overridePin);
            await login(response.access_token, response.user);
        } catch (err: any) {
            setError(err.message || 'Invalid override PIN.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
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

                        {approvalRequest ? (
                            <View style={styles.formSection}>
                                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                                    <Clock size={48} color="#fbe134" style={{ marginBottom: 16 }} />
                                    <Text style={[styles.welcomeTitle, { fontSize: 18 }]}>Waiting for Approval</Text>
                                    <Text style={styles.welcomeSubtitle}>
                                        Your login request has been sent to the shop owner. Please wait.
                                    </Text>
                                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, marginTop: 16, color: '#0b0c0c' }}>
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </Text>
                                </View>

                                {showOverride ? (
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>EMERGENCY OVERRIDE PIN</Text>
                                        <View style={styles.inputWrapper}>
                                            <View style={styles.iconLeft}>
                                                <Key size={20} color="#9CA3AF" />
                                            </View>
                                            <TextInput
                                                style={[styles.input, styles.pinInput]}
                                                placeholder="••••"
                                                secureTextEntry={true}
                                                keyboardType="numeric"
                                                value={overridePin}
                                                onChangeText={setOverridePin}
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                        
                                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                                        
                                        <TouchableOpacity onPress={handleOverride} disabled={isLoading} style={[styles.button, { marginTop: 16 }]}>
                                            {isLoading ? <ActivityIndicator color="#0b0c0c" /> : <Text style={styles.buttonText}>Submit PIN</Text>}
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setShowOverride(false)} style={{ marginTop: 16, alignItems: 'center' }}>
                                            <Text style={styles.forgotText}>Cancel Override</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                                        <TouchableOpacity onPress={() => setShowOverride(true)} style={[styles.button, { backgroundColor: '#F3F4F6' }]}>
                                            <Text style={[styles.buttonText, { color: '#374151' }]}>Use Emergency PIN</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setApprovalRequest(null)} style={{ marginTop: 16, alignItems: 'center' }}>
                                            <Text style={styles.forgotText}>Cancel Login</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        ) : (
                            <>
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
                                                        <Text style={styles.flagEmoji}>🇷🇼</Text>
                                                        <Text style={styles.countryCode}>+250</Text>
                                                        <View style={styles.divider} />
                                                    </View>
                                                    <TextInput
                                                        style={[styles.input, { paddingLeft: 95 }]}
                                                        placeholder="78X XXX XXX"
                                                        keyboardType="phone-pad"
                                                        value={phone}
                                                        onChangeText={setPhone}
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        placeholderTextColor="#9CA3AF"
                                                        textContentType="username"
                                                        autoComplete="username"
                                                    />
                                                </View>
                                            </View>

                                            {/* PIN Input (Segmented) */}
                                            <View style={styles.inputGroup}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                    <Text style={styles.label}>4-DIGIT PIN</Text>
                                                    <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                                                        <Text style={{ fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#fbe134' }}>
                                                            {showPin ? 'Hide' : 'Show'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                
                                                <View style={styles.otpContainer}>
                                                    {[0, 1, 2, 3].map((index) => (
                                                        <View 
                                                            key={index} 
                                                            style={[
                                                                styles.otpBox, 
                                                                pin.length === index && styles.otpBoxActive,
                                                                pin.length > index && styles.otpBoxFilled
                                                            ]}
                                                        >
                                                            <Text style={styles.otpText}>
                                                                {pin[index] ? (showPin ? pin[index] : '•') : ''}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                    <TextInput
                                                        style={styles.hiddenInput}
                                                        keyboardType="numeric"
                                                        maxLength={4}
                                                        value={pin}
                                                        onChangeText={setPin}
                                                        autoFocus={false}
                                                    />
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
                                                        placeholder="Enter email address"
                                                        keyboardType="email-address"
                                                        value={email}
                                                        onChangeText={setEmail}
                                                        autoCapitalize="none"
                                                        placeholderTextColor="#9CA3AF"
                                                        textContentType="username"
                                                        autoComplete="username"
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
                                                        style={[styles.input, styles.passwordInput, { paddingRight: 48 }]}
                                                        placeholder="Enter password"
                                                        secureTextEntry={!showPassword}
                                                        value={password}
                                                        onChangeText={setPassword}
                                                        placeholderTextColor="#9CA3AF"
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        textContentType="password"
                                                        autoComplete="password"
                                                        enablesReturnKeyAutomatically
                                                    />
                                                    <TouchableOpacity
                                                        style={[styles.iconRight, { zIndex: 10 }]}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
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

                                    <View style={styles.signupContainer}>
                                        <Text style={styles.signupText}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => router.push('/register')}>
                                            <Text style={styles.signupLink}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
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
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
        width: '100%',
    },
    header: {
        width: '100%',
        backgroundColor: '#1e1e1e', // Dark header background
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    brandTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 26,
        color: '#fbe134', // Primary Gold
        letterSpacing: -0.5,
    },
    brandSubtitle: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 2,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    welcomeSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#0b0c0c', // Onyx
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 13,
        color: '#6B7280', // Neutral-500
        textAlign: 'center',
        maxWidth: '85%',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        width: '100%',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
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
        fontSize: 13,
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
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 11,
        color: '#6B7280', // Neutral-500
        marginBottom: 6,
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
        paddingVertical: 14,
        paddingLeft: 52, // Increased space for left icon
        paddingRight: 16,
        fontSize: 15,
        color: '#0b0c0c',
        fontFamily: 'Montserrat_400Regular',
    },
    // Segmented PIN styles
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        height: 48,
        gap: 12,
    },
    otpBox: {
        width: 44,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    otpBoxActive: {
        borderColor: '#fbe134',
        backgroundColor: '#FFFFFF',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 1,
    },
    otpBoxFilled: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
    },
    otpText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
    hiddenInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        zIndex: 1,
    },
    iconLeft: {
        position: 'absolute',
        left: 14,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryCode: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 14,
        color: '#4B5563',
        marginRight: 8,
    },
    flagEmoji: {
        fontSize: 18,
        marginRight: 8,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#D1D5DB',
        marginRight: 4,
    },
    passwordInput: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Montserrat_400Regular',
    },
    pinInput: {
        fontFamily: 'Montserrat_700Bold',
        letterSpacing: 8,
    },
    iconRight: {
        position: 'absolute',
        right: 14,
        zIndex: 1,
        padding: 4,
    },
    errorText: {
        fontFamily: 'Montserrat_400Regular',
        color: '#EF4444',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 12,
    },
    button: {
        width: '100%',
        backgroundColor: '#fbe134', // Primary Gold
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
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
        fontSize: 15,
        color: '#0b0c0c',
        marginLeft: 8,
    },
    forgotButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    forgotText: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 13,
        color: '#6B7280',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    signupText: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 13,
        color: '#6B7280',
    },
    signupLink: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 13,
        color: '#fbe134',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        opacity: 0.7,
    },
    footerText: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 11,
        color: '#9CA3AF', // Neutral-400
    },
});
