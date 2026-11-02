// File: app/App.js
// Purpose: Main entry point that initializes the React Navigation container and registers all screen routes.

// Author: Marie Biernacki

// External Sources: Gemini (Code Template)


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screen Components
import HomeScreen from './screens/HomeScreen';
import CollectionScreen from './screens/CollectionScreen';
import AddMediaScreen from './screens/AddMediaScreen';
import EditMediaScreen from './screens/EditMediaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
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