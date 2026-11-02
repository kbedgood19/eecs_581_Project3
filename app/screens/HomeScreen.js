// File: app/screens/HomeScreen.js
// Purpose: Foundational home screen that displays the app title and functional navigation buttons.
// Author: Lauren Lee

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// TODO (Lauren): Uncomment these imports once theme.js and CustomButton.js are complete.
// import { colors, layout, typography } from '../styles/theme';
// import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
    return (
        // TODO (Lauren): Replace styles.container with layout.container and apply colors.background.
        <View style={styles.container}>
            
            {/* TODO (Lauren): Replace styles.title with typography.header. */}
            <Text style={styles.title}>My Media Catalog</Text> 
            
            {/* TODO (Lauren): Replace these TouchableOpacity elements with Sabelli's <CustomButton> component. */}
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Collection')}
            >
                <Text style={styles.buttonText}>View Collection</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('AddMedia')}
            >
                <Text style={styles.buttonText}>Add New Media</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('EditMedia')}
            >
                <Text style={styles.buttonText}>Edit Media</Text>
            </TouchableOpacity>
        </View>
    );
}

// FIXME (Lauren): Delete this entire StyleSheet once the global theme.js is fully integrated.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', 
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    }
});