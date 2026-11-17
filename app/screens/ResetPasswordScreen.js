
// File: app/screens/ResetPasswordScreen.js
// Purpose: Allow users to set a new password after verifying a reset link.

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
import { lightTheme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

export default function ResetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
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
                <CustomButton
                    title="Update Password"
                    onPress={handleUpdatePassword}
                />
            )}
        </ScrollView>
    );
}

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
    }
});
