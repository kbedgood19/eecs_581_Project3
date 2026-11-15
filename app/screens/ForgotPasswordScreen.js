
// File: app/screens/ForgotPasswordScreen.js
// Purpose: Allow users to request a password reset through Supabase.

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

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Missing Information', 'Please enter your email address.');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                email.trim()
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
