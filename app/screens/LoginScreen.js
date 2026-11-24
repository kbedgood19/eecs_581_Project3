
 // File: app/screens/LoginScreen.js
 // Purpose: Allow users to log in using Supabase.
 // Authors: Kaitlyn Bedgood, Lauren Lee

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';

import { supabase } from '../database/supabase';

// SPRINT 3 (Lauren) - REQUIREMENT 12
// PSEUDOCODE (IMPORTS):
// 1. REMOVE the static lightTheme import below
// 2. IMPORT useTheme from '../styles/ThemeContext'
import { lightTheme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({ navigation }) {

    // SPRINT 3 (Lauren) - REQUIREMENT 12
    // PSEUDOCODE (CONNECT TO GLOBAL THEME):
    // 1. CALL the ThemeContext hook to retrieve the active theme object
    // 2. GENERATE the screen's styles object by passing the active theme into createStyles()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Missing Information', 'Please enter your email and password.');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

            if (error) {
                Alert.alert('Login Failed', error.message);
                return;
            }

            // App.js will automatically show Home after login.
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >

            {/* SPRINT 3 (Lauren) - REQUIREMENT 12
                PSEUDOCODE (INLINE THEME REFERENCES):
                1. Update every placeholderTextColor below to use the active theme's secondaryText color
                2. Pass the active theme's primary color to ActivityIndicator for visibility on dark themes */}

            <Text style={styles.header}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={lightTheme.colors.secondaryText}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={lightTheme.colors.secondaryText}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View style={styles.buttonGroup}>
                    <CustomButton title="Login" onPress={handleLogin} />
                    <View style={{ height: 10 }} />

                    <CustomButton
                        title="Create Account"
                        onPress={() => navigation.navigate('SignUp')}
                    />
                    <View style={{ height: 10 }} />

                    <CustomButton
                        title="Forgot Password?"
                        onPress={() => navigation.navigate('ForgotPassword')}
                    />
                </View>
            )}
        </ScrollView>
    );
}

// SPRINT 3 (Lauren) - REQUIREMENT 12
// PSEUDOCODE (CONVERT STATIC STYLES TO DYNAMIC THEME):
// 1. WRAP StyleSheet.create(...) below inside a createStyles(theme) function
// 2. REPLACE every reference to lightTheme inside this stylesheet with the theme parameter
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightTheme.colors.background
    },
    scrollContent: {
        padding: lightTheme.spacing.lg,
        paddingBottom: 40
    },
    header: {
        fontSize: lightTheme.typography.title,
        fontWeight: 'bold',
        marginBottom: lightTheme.spacing.lg,
        color: lightTheme.colors.text,
        textAlign: 'center',
        marginTop: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: lightTheme.colors.text,
        marginBottom: 6,
        marginLeft: 4
    },
    input: {
        width: '100%',
        padding: lightTheme.spacing.md,
        borderWidth: 1,
        borderColor: lightTheme.colors.border,
        borderRadius: lightTheme.radius.md,
        marginBottom: lightTheme.spacing.lg,
        color: lightTheme.colors.text,
        backgroundColor: lightTheme.colors.surface
    },
    buttonGroup: {
        marginTop: 10
    }
});
