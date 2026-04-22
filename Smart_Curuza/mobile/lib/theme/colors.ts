export const lightTheme = {
    background: '#F9FAFB',
    card: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    overlay: 'rgba(0, 0, 0, 0.05)',
    cardOverlay: 'rgba(255, 255, 255, 1)', // Opacity fallback
    brandGold: '#fbe134',
    brandGreen: '#10B981',
    danger: '#EF4444',
};

export const darkTheme = {
    background: '#111827',
    card: '#2a2e34', // Executive Jet Dark
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(255, 255, 255, 0.05)',
    cardOverlay: 'rgba(255, 255, 255, 0.03)',
    brandGold: '#fbe134',
    brandGreen: '#10B981',
    danger: '#F87171',
};

export type ThemeColors = typeof lightTheme;
