// File: app/screens/AccountScreen.js
// Purpose: User profile and app settings (including theme selection).
// Author: Lauren Lee

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

import {
    getTheme,
    lightTheme,
    darkTheme,
    gardenTheme,
    tropicalTheme,
    industrialTheme,
} from '../styles/theme';
import CustomButton from '../components/CustomButton';
// import { supabase } from '../database/supabase'; // Uncomment when linking AccountScreen to Supabase auth

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
    // State for the currently selected theme name
    const [currentThemeName, setCurrentThemeName] = useState('light');

    const theme = getTheme(currentThemeName);
    const styles = createStyles(theme);

    // Mock user data (until Supabase auth is hooked up on this screen)
    const userEmail = "testuser@example.com";

    const handleSignOut = async () => {
        // TODO (Team): Replace with `const { error } = await supabase.auth.signOut();`
        Alert.alert("Sign Out", "You have been signed out.");
    };

    const changeTheme = (themeName) => {
        setCurrentThemeName(themeName);

        // Note: To persist theme changes across the whole app,
        // move this state to a React Context or AsyncStorage in Sprint 3.
    };

    return (
        <ScrollView style={styles.container}>
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
                <Text style={styles.subText}>Choose your aesthetic:</Text>

                {THEME_OPTIONS.map((option) => {
                    const isSelected = currentThemeName === option.id;

                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.themeOption,
                                isSelected && styles.selectedTheme,
                            ]}
                            onPress={() => changeTheme(option.id)}
                            activeOpacity={0.8}
                        >
                            {/* Theme name and description */}
                            <View style={styles.themeInfo}>
                                <Text style={styles.themeName}>
                                    {option.name}
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

                            {/* Selected checkmark */}
                            <Text style={styles.checkmark}>
                                {isSelected ? '✓' : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Sign Out Section */}
            <View style={styles.logoutContainer}>
                <CustomButton title="Sign Out" onPress={handleSignOut} />
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
    logoutContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
});