// File: app/App.js
// Purpose: Main entry point that initializes the React Navigation container and registers all screen routes.

// Author: Marie Biernacki

// External Sources: Gemini (Code Template)

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createTables } from './database/schema';
import { getDatabase } from './database/database';

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