// File: app/App.js
// Purpose: Main entry point that initializes the React Navigation container and registers all screen routes.

// Author: Marie Biernacki

// External Sources: Gemini (Code Template)

import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
// import { View, Text, ActivityIndicator } from 'react-native';
import { View, Text, ActivityIndicator, Button, Alert } from 'react-native';
import { createTables } from './database/schema';
import { getDatabase } from './database/database';

import { supabase } from './database/supabase';


import {
    getMediaCatalog as getSupabaseMediaCatalog,
    addMediaItem as addSupabaseMediaItem
} from './database/supabaseController';



//import database functions for counting records and inserting and retrieving the sample item
import {
    countMediaRecords,
    countFeedbackRecords,
    insertSampleItem,
    retrieveSampleItem
} from './database/controller';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screen Components
import HomeScreen from './screens/HomeScreen';
import CollectionScreen from './screens/CollectionScreen';
import AddMediaScreen from './screens/AddMediaScreen';
import EditMediaScreen from './screens/EditMediaScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [databaseReady, setDatabaseReady] = useState(false);
    const [databaseError, setDatabaseError] = useState(null);
    const [session, setSession] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

    // Initialize SQLite when the application starts.
    useEffect(() => {
        async function initializeDatabase() {
            try {
                await createTables();
                console.log('SQLite database initialized successfully!');

                // //temporary test for inserting and retrieving the sample item
                // const sampleId = await insertSampleItem(); //insert the sample item
                // const sampleItem = await retrieveSampleItem(sampleId); //retrieve the saved item
                // console.log('saved sample:', sampleItem); //display its values for verification

                // TEMPORARY TEST: Count records in both tables.
                const mediaCount = await countMediaRecords();
                const feedbackCount = await countFeedbackRecords();

                console.log('MediaItem count:', mediaCount);
                console.log('UserFeedback count:', feedbackCount);
                // Display all saved media items from SQLite.
                const db = await getDatabase();

                const savedMedia = await db.getAllAsync(
                    'SELECT * FROM MediaItem;'
                );

                console.log('Saved media items:', savedMedia);
                // TEMPORARY TEST: Check Supabase connection
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Supabase connection test error:', error.message);
                } else {
                    console.log('Supabase client initialized!');
                    console.log('Current session:', data.session ? 'Logged in' : 'Not logged in');

                    if (data.session?.user) {
                        try {
                            const media = await getSupabaseMediaCatalog(data.session.user.id);
                            console.log('Supabase media items:', media);
                        } catch (error) {
                            console.error('Supabase media test failed:', error.message);
                        }
                    }

                }
                setDatabaseReady(true);
            } catch (error) {
                console.error('Database initialization failed:', error);
                setDatabaseError(error.message);
            }
        }

        initializeDatabase();
    }, []);


    // Handle password reset links opened through Expo Go.
    useEffect(() => {
        const handlePasswordResetLink = async (url) => {
            if (!url || !url.includes('reset-password')) {
                return;
            }

            try {
                // Supabase returns authentication tokens in the URL.
                const fragment = url.split('#')[1];

                if (!fragment) {
                    console.log('No recovery tokens found in the link.');
                    return;
                }

                const params = new URLSearchParams(fragment);
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                const type = params.get('type');

                if (type !== 'recovery' || !accessToken || !refreshToken) {
                    console.log('Invalid password recovery link.');
                    return;
                }

                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                if (error) {
                    console.error('Password recovery error:', error.message);
                    return;
                }

                setIsPasswordRecovery(true);
            } catch (error) {
                console.error('Error handling reset link:', error);
            }
        };

        // Handle a link that opened the app from a closed state.
        Linking.getInitialURL().then(handlePasswordResetLink);

        // Handle a link while the app is already running.
        const subscription = Linking.addEventListener(
            'url',
            ({ url }) => handlePasswordResetLink(url)
        );

        return () => subscription.remove();
    }, []);

// Check login status and listen for authentication changes.
useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
        if (!active) return;

        if (error) {
            console.error('Session check failed:', error.message);
        }

        setSession(data.session);
        setAuthReady(true);
    });

    const { data: { subscription } } =
        supabase.auth.onAuthStateChange((event, newSession) => {
            if (active) {
                setSession(newSession);
                setAuthReady(true);
                if (event === 'PASSWORD_RECOVERY') {
                    setIsPasswordRecovery(true);
                }

                if (event === 'SIGNED_OUT') {
                    setIsPasswordRecovery(false);
                }
            }
        });

    return () => {
        active = false;
        subscription.unsubscribe();
    };
}, []);

//used to test supabase, don't delete
// const testSupabaseInsert = async () => {
//     try {
//         if (!session?.user) {
//             Alert.alert('Error', 'Please log in first.');
//             return;
//         }

//         const media = await getSupabaseMediaCatalog(session.user.id);

//         console.log('Supabase retrieved media:', media);

//         Alert.alert(
//             'Retrieval Test',
//             `Found ${media.length} media item(s) in Supabase!`
//         );
//     } catch (error) {
//         console.error('Supabase retrieval test failed:', error.message);
//         Alert.alert('Error', error.message);
//     }
// };


    // Display an error if the database fails to initialize.
    if (databaseError) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <Text>Database initialization failed: {databaseError}</Text>
            </View>
        );
    }

    // Wait until the database and authenticationis ready.
    if (!databaseReady || !authReady) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" />
                <Text>Loading app...</Text>
            </View>
        );
    }
    
    return (



<NavigationContainer>
    <Stack.Navigator>

            {isPasswordRecovery ? (
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                />
            ) : session ? (
                <>
                    

                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Collection" component={CollectionScreen} />
                    <Stack.Screen name="AddMedia" component={AddMediaScreen} />
                    <Stack.Screen name="EditMedia" component={EditMediaScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

                </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
    );
}