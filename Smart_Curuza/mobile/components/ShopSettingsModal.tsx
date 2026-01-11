import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, Store, Phone, FileText, MapPin, Save } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

interface ShopSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ShopSettingsModal({ visible, onClose }: ShopSettingsModalProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        business_name: '',
        phone: '',
        tin: '',
        address: ''
    });

    useEffect(() => {
        if (visible) {
            fetchProfile();
        }
    }, [visible]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await ApiClient.getMerchantProfile();
            setProfile({
                business_name: data.business_name || '',
                phone: data.phone || '',
                tin: data.tin || '',
                address: data.address || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            Alert.alert('Error', 'Failed to load shop settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile.business_name || !profile.phone) {
            Alert.alert('Error', 'Business Name and Phone are required');
            return;
        }

        setSaving(true);
        try {
            await ApiClient.updateMerchantProfile(profile);
            Alert.alert('Success', 'Shop settings saved successfully');
            onClose();
        } catch (error) {
            console.error('Failed to save profile:', error);
            Alert.alert('Error', 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Shop Settings</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#111827" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#fbe134" />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Business Name</Text>
                            <View style={styles.inputContainer}>
                                <Store size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={profile.business_name}
                                    onChangeText={(text) => setProfile(prev => ({ ...prev, business_name: text }))}
                                    placeholder="Enter shop name"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <Phone size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={profile.phone}
                                    onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
                                    placeholder="+250..."
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>TIN Number</Text>
                            <View style={styles.inputContainer}>
                                <FileText size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={profile.tin}
                                    onChangeText={(text) => setProfile(prev => ({ ...prev, tin: text }))}
                                    placeholder="Tax Identification Number"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address</Text>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <MapPin size={20} color="#6B7280" style={[styles.inputIcon, styles.textAreaIcon]} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={profile.address}
                                    onChangeText={(text) => setProfile(prev => ({ ...prev, address: text }))}
                                    placeholder="Shop location..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </ScrollView>
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveButton, (loading || saving) && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={loading || saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#111827" />
                        ) : (
                            <>
                                <Save size={20} color="#111827" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#374151',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        color: '#111827',
    },
    textAreaContainer: {
        height: 100,
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    textAreaIcon: {
        marginTop: 2,
    },
    textArea: {
        height: '100%',
    },
    footer: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fbe134',
        paddingVertical: 16,
        borderRadius: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: '#111827',
    },
});
