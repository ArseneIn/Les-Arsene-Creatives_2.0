import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, User, Phone, Mail, ShieldAlert } from 'lucide-react-native';
import { useAuth } from '../lib/auth/AuthContext';

interface PersonalInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PersonalInfoModal({ visible, onClose }: PersonalInfoModalProps) {
    const { user } = useAuth();

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
                    <Text style={styles.title}>Personal Information</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#111827" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <User size={20} color="#6B7280" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Full Name</Text>
                                <Text style={styles.value}>{user?.name || 'Not provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Phone size={20} color="#6B7280" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Phone Number</Text>
                                <Text style={styles.value}>{user?.phone || 'Not provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Mail size={20} color="#6B7280" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <Text style={styles.value}>{user?.email || 'Not provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <ShieldAlert size={20} color="#6B7280" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Role</Text>
                                <Text style={[styles.value, styles.roleValue]}>{user?.role || 'User'}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <Text style={styles.helpText}>
                        To update your personal information or change your registered phone number, please contact system administration.
                    </Text>
                </ScrollView>
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
    content: {
        padding: 24,
        gap: 20,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#111827',
    },
    roleValue: {
        textTransform: 'capitalize',
        color: '#059669', // emerald-600
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 56, // Align with text
    },
    helpText: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        fontFamily: 'Montserrat_500Medium',
        marginTop: 16,
        lineHeight: 20,
    }
});
