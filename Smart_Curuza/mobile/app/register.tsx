import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ApiClient } from '../lib/api_client';
import { useAuth } from '../lib/auth/AuthContext';
import { User, Store, Lock, Eye, EyeOff, ChevronRight, ChevronLeft, CheckCircle2, Mail, Smartphone, Building, MapPin, Hash, Key } from 'lucide-react-native';
import ScreenWrapper from '../components/ScreenWrapper';

type Step = 1 | 2 | 3 | 'success';

export default function RegisterScreen() {
    const [step, setStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Personal Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Step 2: Business Info
    const [businessName, setBusinessName] = useState('');
    const [tin, setTin] = useState('');
    const [address, setAddress] = useState('');

    // Step 3: Security
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPin, setShowPin] = useState(false);

    const router = useRouter();
    const { login } = useAuth();

    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (!name || !phone) {
                setError('Name and Phone are required');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!businessName) {
                setError('Business Name is required');
                return;
            }
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        if (step === 3) setStep(2);
    };

    const handleRegister = async () => {
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!pin || pin.length !== 4) {
            setError('PIN must be 4 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const registrationData = {
                name,
                email,
                phone,
                business_name: businessName,
                tin,
                address,
                password,
                pin,
                role: 'MERCHANT' // Default role for registration
            };

            const response = await ApiClient.register(registrationData);

            // After successful registration, we might want to auto-login
            // or show a success screen. Let's show a success screen.
            setStep('success');

            // Auto-login after a short delay
            setTimeout(async () => {
                try {
                    const loginResponse = await ApiClient.login({ phone, pin });
                    await login(loginResponse.access_token, loginResponse.user);
                } catch (e) {
                    // If auto-login fails, just go to login screen
                    router.replace('/login');
                }
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.formSection}>
            <Text style={styles.stepTitle}>Account Holder</Text>
            <Text style={styles.stepSubtitle}>Basic information to identify you.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>FULL NAME</Text>
                <View style={styles.inputWrapper}>
                    <View style={styles.iconLeft}><User size={20} color="#9CA3AF" /></View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter full name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

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
                        placeholder="788 123 456"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS (OPTIONAL)</Text>
                <View style={styles.inputWrapper}>
                    <View style={styles.iconLeft}><Mail size={20} color="#9CA3AF" /></View>
                    <TextInput
                        style={styles.input}
                        placeholder="arsene@example.com"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                <Text style={styles.primaryButtonText}>Next: Business Profile</Text>
                <ChevronRight size={20} color="#0b0c0c" />
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.formSection}>
            <Text style={styles.stepTitle}>Business Profile</Text>
            <Text style={styles.stepSubtitle}>Details about your shop or company.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>BUSINESS NAME</Text>
                <View style={styles.inputWrapper}>
                    <View style={styles.iconLeft}><Building size={20} color="#9CA3AF" /></View>
                    <TextInput
                        style={styles.input}
                        placeholder="Smart Curuza Shop"
                        value={businessName}
                        onChangeText={setBusinessName}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>TIN (TAX ID)</Text>
                <View style={styles.inputWrapper}>
                    <View style={styles.iconLeft}><Hash size={20} color="#9CA3AF" /></View>
                    <TextInput
                        style={styles.input}
                        placeholder="123456789"
                        keyboardType="numeric"
                        value={tin}
                        onChangeText={setTin}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>BUSINESS ADDRESS</Text>
                <View style={styles.inputWrapper}>
                    <View style={styles.iconLeft}><MapPin size={20} color="#9CA3AF" /></View>
                    <TextInput
                        style={styles.input}
                        placeholder="Kigali, Rwanda"
                        value={address}
                        onChangeText={setAddress}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                    <ChevronLeft size={20} color="#374151" />
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                    <Text style={styles.primaryButtonText}>Next: Security</Text>
                    <ChevronRight size={20} color="#0b0c0c" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.formSection}>
            <Text style={styles.stepTitle}>Security & Access</Text>
            <Text style={styles.stepSubtitle}>Set up your access credentials.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>PORTAL PASSWORD</Text>
                <View style={styles.inputWrapper}>
                    <View style={styles.iconLeft}><Lock size={20} color="#9CA3AF" /></View>
                    <TextInput
                        style={styles.input}
                        placeholder="Minimum 6 characters"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity style={styles.iconRight} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={styles.label}>4-DIGIT POS PIN</Text>
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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                    <ChevronLeft size={20} color="#374151" />
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#0b0c0c" /> : (
                        <>
                            <Text style={styles.primaryButtonText}>Complete Setup</Text>
                            <CheckCircle2 size={20} color="#0b0c0c" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSuccess = () => (
        <View style={styles.successSection}>
            <View style={styles.successIconWrapper}>
                <CheckCircle2 size={80} color="#fbe134" />
            </View>
            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successSubtitle}>
                Welcome to Smart Curuza. We are setting up your workspace and redirecting you to the dashboard...
            </Text>
            <ActivityIndicator color="#fbe134" style={{ marginTop: 32 }} />
        </View>
    );

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Progress Bar */}
                    {step !== 'success' && (
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${(step as number) * 33.33}%` }]} />
                        </View>
                    )}

                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.brandTitle}>Smart-Curuza</Text>
                            <Text style={styles.brandSubtitle}>NEW MERCHANT SIGNUP</Text>
                        </View>

                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 'success' && renderSuccess()}
                    </View>

                    {step !== 'success' && (
                        <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
                            <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkHighlight}>Login</Text></Text>
                        </TouchableOpacity>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#fbe134',
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
    },
    header: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    brandTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 26,
        color: '#fbe134',
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
    formSection: {
        width: '100%',
    },
    stepTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        color: '#0b0c0c',
        marginBottom: 4,
    },
    stepSubtitle: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 11,
        color: '#6B7280',
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
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 14,
        paddingLeft: 52,
        paddingRight: 16,
        fontSize: 15,
        color: '#0b0c0c',
        fontFamily: 'Montserrat_400Regular',
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
    iconRight: {
        position: 'absolute',
        right: 14,
        zIndex: 1,
        padding: 4,
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
    errorText: {
        fontFamily: 'Montserrat_400Regular',
        color: '#EF4444',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 12,
    },
    primaryButton: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#fbe134',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 15,
        color: '#0b0c0c',
        marginRight: 8,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    secondaryButtonText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 15,
        color: '#374151',
        marginLeft: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginLinkText: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 13,
        color: '#6B7280',
    },
    loginLinkHighlight: {
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
    },
    successSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    successIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FDFBE7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#0b0c0c',
        textAlign: 'center',
        marginBottom: 10,
    },
    successSubtitle: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    }
});
