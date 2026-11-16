// File: app/screens/AccountScreen.js
// Purpose: User profile and app settings (including theme selection).
// Author: Lauren Lee

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

// SPRINT 2 TODO (Lauren): Import getTheme and your new themes from theme.js once you build them!
import { lightTheme } from '../styles/theme'; 
import CustomButton from '../components/CustomButton';
// import { supabase } from '../database/supabase'; // Uncomment when the team fully links Supabase auth

export default function AccountScreen({ navigation }) {
    // State for the currently selected theme name
    const [currentThemeName, setCurrentThemeName] = useState('light');

    // SPRINT 2 TODO (Lauren): Use your updated getTheme function here!
    // Example: const theme = getTheme(currentThemeName);
    const theme = lightTheme; // Temporary fallback so the screen doesn't crash before your themes are done
    const styles = createStyles(theme);

    // Mock user data (until Supabase auth is fully hooked up)
    const userEmail = "testuser@example.com";

    const handleSignOut = async () => {
        // SPRINT 2 TODO (Team): Add Supabase sign out logic here later
        // await supabase.auth.signOut();
        
        Alert.alert("Sign Out", "You have been signed out.");
        
        // SPRINT 2 TODO (Team): Navigate back to the Login screen once the auth flow is built
        // navigation.replace('Login'); 
    };

    const changeTheme = (themeName) => {
        setCurrentThemeName(themeName);
        
        // Note for Lauren: To make this theme change persist across the WHOLE app,
        // we will eventually need to move this state to a React Context or use AsyncStorage.
        // For Sprint 2, just focus on building the UI and getting local state toggling to work on this screen!
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>My Account</Text>

            {/* Profile Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Details</Text>
                <Text style={styles.label}>Email: {userEmail}</Text>
                {/* SPRINT 2 TODO (Lauren): Add any other profile UI or avatar placeholders you want here */}
            </View>

            {/* Theme Selection Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Theme</Text>
                <Text style={styles.subText}>Choose your aesthetic:</Text>

                {/* SPRINT 2 TODO (Lauren): Build out the UI for selecting your new themes! */}
                {/* You could map over an array of theme names ['light', 'dark', 'garden', 'tropical', 'industrial'] */}
                {/* and render a TouchableOpacity button for each one. */}
                {/* Make sure to call changeTheme('themeName') in their onPress events! */}

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
    logoutContainer: {
        marginTop: 20,
        marginBottom: 40,
    }
    // SPRINT 2 TODO (Lauren): Add any specific styles you need for your theme selector UI here!
});