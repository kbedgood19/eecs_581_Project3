
// File: app/screens/ResetPasswordScreen.js
// Purpose: Allow users to set a new password after verifying a reset code.
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


// SPRINT 3 (Kaitlyn) - REQUIREMENT 9.3
// PSEUDOCODE (PROPS & STATE FOR OTP VERIFICATION):
// 1. ACCEPT { route, navigation, setIsPasswordRecovery } as props in ResetPasswordScreen
// 2. ADD state for email, initialized from route?.params?.email with an empty string fallback
// 3. ADD state for code (the OTP reset code entered by the user), initialized to ''
// 4. ADD boolean state isCodeVerified, initialized to false
//    (Why: OTP codes are single-use. If verifyOtp succeeds but updateUser fails—such as reusing the old password—
//    tracking isCodeVerified lets the user retry updateUser without failing on an already-consumed OTP)

export default function ResetPasswordScreen() {

    // SPRINT 3 (Lauren) - REQUIREMENT 12
    // PSEUDOCODE (CONNECT TO GLOBAL THEME):
    // 1. CALL the ThemeContext hook to retrieve the active theme object
    // 2. GENERATE the screen's styles object by passing the active theme into createStyles()

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);



    // SPRINT 3 (Kaitlyn) - REQUIREMENT 9.3
    // PSEUDOCODE (VERIFY OTP & UPDATE PASSWORD):
    // 1. VALIDATE that email.trim(), code.trim(), password, and confirmPassword are all filled in
    // 2. KEEP the existing password length (>= 6) and password match checks
    // 3. SET loading to true and inside the try block:
    //    a. IF isCodeVerified is false:
    //       - CALL setIsPasswordRecovery(true) BEFORE calling verifyOtp so AppNavigator keeps this screen mounted
    //       - CALL supabase.auth.verifyOtp with { email: email.trim(), token: code.trim(), type: 'recovery' }
    //       - IF verifyOtp returns an error:
    //           * CALL setIsPasswordRecovery(false)
    //           * SHOW an Alert with the error message and return early
    //       - SET isCodeVerified to true
    //    b. CALL supabase.auth.updateUser({ password }) (existing step)
    //       - IF updateUser returns an error, SHOW an Alert with the error message and return early
    //         (Note: leave isPasswordRecovery and isCodeVerified true so the user can fix the password and retry)
    //    c. CALL supabase.auth.signOut() to clear the temporary recovery session, then CALL setIsPasswordRecovery(false)
    //    d. CLEAR code, password, confirmPassword, and RESET isCodeVerified to false
    //    e. SHOW the success Alert and, on 'OK', NAVIGATE back to the 'Login' screen (e.g., navigation.popToTop() or navigation.navigate('Login'))
    const handleUpdatePassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Missing Information', 'Please fill in both fields.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            const { error: signOutError } = await supabase.auth.signOut();

            if (signOutError) {
                Alert.alert(
                    'Password Updated',
                    'Your password was changed, but signing out failed. Please try logging out manually.'
                );
                return;
            }

            Alert.alert(
                'Success',
                'Your password has been updated! Please log in with your new password.'
            );

            setPassword('');
            setConfirmPassword('');

        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // SPRINT 3 (Kaitlyn) - REQUIREMENT 9.3
    // PSEUDOCODE (SAFE BACK TO LOGIN HANDLER):
    // 1. CREATE an async handleBackToLogin helper function
    // 2. IF isCodeVerified is true, CALL supabase.auth.signOut() first so the temporary recovery session
    //    cannot drop the user into HomeScreen without finishing the reset
    // 3. CALL setIsPasswordRecovery(false) and SET isCodeVerified to false
    // 4. NAVIGATE back to the 'Login' screen
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

            
            {/* SPRINT 3 (Kaitlyn) - REQUIREMENT 9.3
                PSEUDOCODE (ADD EMAIL & OTP INPUTS + BACK BUTTON):
                1. UPDATE the description text to instruct the user to enter the code from their email and their new password
                2. ADD a labeled TextInput for Email (bound to email state, autoCapitalize="none", keyboardType="email-address")
                   - Disable editing once isCodeVerified is true
                3. ADD a labeled TextInput for Reset Code (bound to code state, keyboardType="number-pad", autoCapitalize="none")
                   - Do NOT hardcode maxLength={6} in case Supabase sends an 8-digit token
                   - Disable editing once isCodeVerified is true
                4. REUSE styles.label, styles.input, and the theme's secondaryText placeholder color so these inputs
                   stay consistent with Lauren's Requirement 12 theme updates
                5. ADD a 10px spacer View and a "Back to Login" CustomButton inside the styles.buttonGroup View below "Update Password", calling handleBackToLogin */}
            
            
            <Text style={styles.header}>Reset Password</Text>

            <Text style={styles.description}>
                Enter your new password below.
            </Text>

            <Text style={styles.label}>New Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor={lightTheme.colors.secondaryText}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={lightTheme.colors.secondaryText}
                secureTextEntry
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View style={styles.buttonGroup}>
                    <CustomButton
                        title="Update Password"
                        onPress={handleUpdatePassword}
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
