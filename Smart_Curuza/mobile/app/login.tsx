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
                                                        <Smartphone size={20} color="#9CA3AF" />
                                                    </View>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="078X XXX XXX"
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
                                                        style={[styles.input, styles.passwordInput, { paddingRight: 48, zIndex: 1 }]}
                                                        placeholder="Password"
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
                                                        style={[styles.iconRight, { zIndex: 99 }]}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
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
    passwordInput: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Montserrat_400Regular',
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    signupText: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14,
        color: '#6B7280',
    },
    signupLink: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 14,
        color: '#fbe134',
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
