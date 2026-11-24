
// File: app/screens/ForgotPasswordScreen.js
// Purpose: Allow users to request a password reset through Supabase.
// Authors: Kaitlyn Bedgood, Lauren Lee


// SPRINT 3 (Kaitlyn) - REQUIREMENT 9.3
// PSEUDOCODE (REMOVE DEEP LINK IMPORT):
// 1. REMOVE the expo-linking import below since reset codes do not require a redirect URL
import * as Linking from 'expo-linking';
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

export default function ForgotPasswordScreen({ navigation }) {
    // SPRINT 3 (Lauren) - REQUIREMENT 12
    // PSEUDOCODE (CONNECT TO GLOBAL THEME):
    // 1. CALL the ThemeContext hook to retrieve the active theme object
    // 2. GENERATE the screen's styles object by passing the active theme into createStyles()
    
    
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);




    // SPRINT 3 (Kaitlyn) - REQUIREMENT 9.3
    // PSEUDOCODE (REQUEST OTP RESET CODE & NAVIGATE TO RESET SCREEN):
    // 1. KEEP the empty-email validation and store the trimmed email in a local variable
    // 2. REMOVE the console.log calling Linking.createURL(...)
    // 3. CALL supabase.auth.resetPasswordForEmail() with ONLY the trimmed email (remove the { redirectTo: ... } object)
    // 4. IF no error is returned, SHOW a confirmation Alert letting the user know a reset code has been sent
    // 5. WHEN the user presses 'OK' on the Alert, NAVIGATE to 'ResetPassword' and pass { email: trimmedEmail } as route params
    //    (instead of calling navigation.goBack())
    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Missing Information', 'Please enter your email address.');
            return;
        }

        setLoading(true);

        try {
            console.log('Password reset redirect:', Linking.createURL('reset-password'));
            const { error } = await supabase.auth.resetPasswordForEmail(
                email.trim(),
                {
                    redirectTo: Linking.createURL('reset-password')
                }
            );

            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            Alert.alert(
                'Check Your Email',
                'If an account exists for this email, a password reset link has been sent.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );

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
                1. Update placeholderTextColor below to use the active theme's secondaryText color
                2. Pass the active theme's primary color to ActivityIndicator for visibility on dark themes */}

            
            {/* SPRINT 3 (Kaitlyn) - REQUIREMENT 9.3
                PSEUDOCODE (UPDATE OTP UI COPY):
                1. UPDATE the description text below to mention requesting a password reset code instead of a link
                2. UPDATE the primary CustomButton title from "Send Reset Link" to "Send Reset Code"
                3. OPTIONAL: Add a button to navigate directly to 'ResetPassword' (passing trimmed email if typed)
                   in case the user already received a code and wants to enter it without requesting a new email */}
            
            
            <Text style={styles.header}>Forgot Password</Text>

            <Text style={styles.description}>
                Enter your email address to request a password reset link.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={lightTheme.colors.secondaryText}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View style={styles.buttonGroup}>
                    <CustomButton
                        title="Send Reset Link"
                        onPress={handleResetPassword}
                    />
                    <View style={{ height: 10 }} />
                    <CustomButton
                        title="Back to Login"
                        onPress={() => navigation.goBack()}
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
        marginBottom: lightTheme.spacing.md,
        color: lightTheme.colors.text,
        textAlign: 'center',
        marginTop: 20
    },
    description: {
        fontSize: 14,
        color: lightTheme.colors.secondaryText,
        textAlign: 'center',
        marginBottom: lightTheme.spacing.lg
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
