// File: app/App.js
// Purpose: Main entry point that initializes the React Navigation container and registers all screen routes.

// Author: Marie Biernacki

// External Sources: Gemini (Code Template)

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createTables } from './database/schema';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screen Components
import HomeScreen from './screens/HomeScreen';
import CollectionScreen from './screens/CollectionScreen';
import AddMediaScreen from './screens/AddMediaScreen';
import EditMediaScreen from './screens/EditMediaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [databaseReady, setDatabaseReady] = useState(false);
    const [databaseError, setDatabaseError] = useState(null);

    // Initialize SQLite when the application starts.
    useEffect(() => {
        async function initializeDatabase() {
            try {
                await createTables();
                console.log('SQLite database initialized successfully!');
                setDatabaseReady(true);
            } catch (error) {
                console.error('Database initialization failed:', error);
                setDatabaseError(error.message);
            }
        }

        initializeDatabase();
    }, []);

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

    // Wait until the database is ready.
    if (!databaseReady) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" />
                <Text>Loading database...</Text>
            </View>
        );
    }
    
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Collection" component={CollectionScreen} />
                <Stack.Screen name="AddMedia" component={AddMediaScreen} />
                <Stack.Screen name="EditMedia" component={EditMediaScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}