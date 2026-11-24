// File: app/screens/AccountScreen.js
// Purpose: User profile and app settings (including theme selection).
// Author: Lauren Lee, Marie Biernacki

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    StatusBar,
} from 'react-native';

import {
    getTheme,
    lightTheme,
    darkTheme,
    gardenTheme,
    tropicalTheme,
    industrialTheme,
} from '../styles/theme';

// SPRINT 3 (Marie): import statements for themes, getting user information
import { useTheme } from '../styles/ThemeContext';
import CustomButton from '../components/CustomButton';
import { supabase } from '../database/supabase';



const THEME_OPTIONS = [
    {
        id: 'light',
        name: 'Light',
        description: 'Clean and bright default palette',
        colors: [
            lightTheme.colors.background,
            lightTheme.colors.primary,
            lightTheme.colors.text,
        ],
    },
    {
        id: 'dark',
        name: 'Dark',
        description: 'Low-light charcoal and periwinkle',
        colors: [
            darkTheme.colors.background,
            darkTheme.colors.primary,
            darkTheme.colors.text,
        ],
    },
    {
        id: 'garden',
        name: 'Garden',
        description: 'Soft greens and earthy tones',
        colors: [
            gardenTheme.colors.background,
            gardenTheme.colors.primary,
            gardenTheme.colors.text,
        ],
    },
    {
        id: 'tropical',
        name: 'Tropical',
        description: 'Ocean blues and warm coral accents',
        colors: [
            tropicalTheme.colors.background,
            tropicalTheme.colors.primary,
            tropicalTheme.colors.danger,
        ],
    },
    {
        id: 'industrial',
        name: 'Industrial',
        description: 'Dark slate and cool steel blues',
        colors: [
            industrialTheme.colors.background,
            industrialTheme.colors.primary,
            industrialTheme.colors.text,
        ],
    },
];

export default function AccountScreen({ navigation }) {
    
    // SPRINT 3 (Marie): read saved global theme name and updater from ThemeContext
    const { themeName: activeThemeName, setThemeName } = useTheme();

    // SPRINT 3 (Marie): local preview state lets users inspect a theme before applying globally
    const [previewThemeName, setPreviewThemeName] = useState(activeThemeName);
    const [userEmail, setUserEmail] = useState('Loading...');

    // keep preview state synced if global theme changes elsewhere
    useEffect(() => {
        setPreviewThemeName(activeThemeName);
    }, [activeThemeName]);

    // SPRINT 3 (Marie): fetch currently signed-in user's email from Supabase on mount
    useEffect(() => {
        let isActive = true;

        async function loadUserProfile() {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('Failed to fetch user profile:', error.message);
                    if (isActive) setUserEmail('Unavailable');
                    return;
                }
                if (isActive) {
                    setUserEmail(user?.email || 'No email found');
                }
            } catch (err) {
                console.error('Unexpected error fetching user profile:', err);
                if (isActive) setUserEmail('Unavailable');
            }
        }

        loadUserProfile();

        return () => {
            isActive = false;
        };
    }, []);

    // SPRINT 3 (Marie): derive live preview theme tokens and status flags
    const previewTheme = getTheme(previewThemeName);
    const isPreviewDark = previewThemeName === 'dark' || previewThemeName === 'industrial';
    const hasUnsavedChange = previewThemeName !== activeThemeName;
    const selectedOption = THEME_OPTIONS.find((opt) => opt.id === previewThemeName);
    
    const styles = createStyles(previewTheme);

    // SPRINT 3 (Marie): sign out of Supabase (App.js auth listener handles navigating back to Login)
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign Out Error', error.message);
        }
    };

    // SPRINT 3 (Marie): preview theme locally on AccountScreen without changing other screens yet
    const handlePreviewTheme = (selectedThemeId) => {
        setPreviewThemeName(selectedThemeId);
    };

    // SPRINT 3 (Marie): commit the previewed theme globally across the entire app
    const handleApplyTheme = async () => {
        if (!hasUnsavedChange) return;

        await setThemeName(previewThemeName);
        Alert.alert(
            'Theme Applied',
            `${selectedOption?.name || previewThemeName} theme has been applied across the app.`
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* SPRINT 3 (Marie): status bar updates live with the previewed theme */}
            <StatusBar
                barStyle={isPreviewDark ? 'light-content' : 'dark-content'}
                backgroundColor={previewTheme.colors.statusBar}
            />

            <Text style={styles.header}>My Account</Text>

            {/* Profile Section */}
            <View style={styles.section}>
                <View style={styles.profilePictureContainer}>
                    <View style={styles.profilePicture}>
                        <Text style={styles.profilePictureIcon}>👤</Text>
                    </View>

                    {/* Placeholder button for future profile photo upload */}
                    <TouchableOpacity
                        onPress={() =>
                            Alert.alert(
                                "Profile Picture",
                                "Change profile picture functionality (to be implemented later)"
                            )
                        }
                    >
                        <Text style={styles.changePhotoText}>Add Profile Picture</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Details */}
                <Text style={styles.sectionTitle}>Profile Details</Text>
                <Text style={styles.label}>Email: {userEmail}</Text>
            </View>

            {/* Theme Selection Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Theme</Text>
                <Text style={styles.subText}>
                    Tap a theme to preview it, then apply to update the whole app:
                </Text>

                {THEME_OPTIONS.map((option) => {
                    const isPreviewed = previewThemeName === option.id;
                    const isActive = activeThemeName === option.id;

                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.themeOption,
                                isPreviewed && styles.selectedTheme,
                            ]}
                            onPress={() => handlePreviewTheme(option.id)}
                            activeOpacity={0.8}
                        >
                            {/* SPRINT 3 (Marie): Theme name and description */}
                            <View style={styles.themeInfo}>
                                <Text style={styles.themeName}>
                                    {option.name}
                                    {isActive ? ' (Active)' : ''}
                                </Text>

                                <Text style={styles.themeDescription}>
                                    {option.description}
                                </Text>
                            </View>

                            {/* Color preview circles */}
                            <View style={styles.colorPreview}>
                                {option.colors.map((color, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: color },
                                        ]}
                                    />
                                ))}
                            </View>

                            {/* Previewed checkmark */}
                            <Text style={styles.checkmark}>
                                {isPreviewed ? '✓' : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            
            {/* SPRINT 3 (Marie): apply button commits previewed theme to ThemeContext */}
                <View style={styles.applyButtonContainer}>
                    <CustomButton
                        title={
                            hasUnsavedChange
                                ? `Apply ${selectedOption?.name || previewThemeName} Theme`
                                : 'Current Theme Active'
                        }
                        onPress={handleApplyTheme}
                        themeOverride={previewTheme}
                    />
                </View>
            </View>

            {/* SPRINT 3 (Marie): Log Out Button updates with preview*/}
            <View style={styles.logoutContainer}>
                <CustomButton
                    title="Log Out"
                    onPress={handleSignOut}
                    themeOverride={previewTheme}
                />
            </View>
        </ScrollView>
    );
}

/* ================= STYLES ================= */
const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing?.lg || 24,
    },
    header: {
        fontSize: theme.typography?.title || 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 20,
        marginBottom: 24,
        textAlign: 'center',
    },
    section: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius?.md || 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sectionTitle: {
        fontSize: theme.typography?.heading || 20,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: theme.colors.secondaryText,
    },
    subText: {
        fontSize: 14,
        color: theme.colors.secondaryText,
        marginBottom: 16,
    },
    // Individual theme selection button
    themeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    // Highlight the currently selected theme
    selectedTheme: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
        backgroundColor: theme.colors.primaryLight,
    },
    themeInfo: {
        flex: 1,
    },
    themeName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    themeDescription: {
        fontSize: 12,
        color: theme.colors.secondaryText,
    },
    // Small circles showing each theme's colors
    colorPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    colorCircle: {
        width: 17,
        height: 17,
        borderRadius: 999,
        marginLeft: 4,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    checkmark: {
        width: 18,
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
    },
    // Profile picture styles and container
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        marginBottom: 10,
    },
    profilePictureIcon: {
        fontSize: 42,
    },
    changePhotoText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },

    // SPRINT 3 (Marie): live preview card styles for requirement 12.3
    previewCard: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    previewLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.6,
        color: theme.colors.primary,
        marginBottom: 6,
    },
    previewTitle: {
        fontSize: theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    previewMeta: {
        fontSize: theme.typography.caption,
        color: theme.colors.secondaryText,
    },
    applyButtonContainer: {
        marginTop: theme.spacing.xs,
    },

    logoutContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
});