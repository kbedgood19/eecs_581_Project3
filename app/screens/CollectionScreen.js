// File: app/screens/CollectionScreen.js
// Purpose: Valid destination target for viewing the media collection and navigating back home[cite: 1].
// Author: Marie Biernacki

// External Sources: Gemini (Code Template)


import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// TODO (Marie): Once Lauren and Sabelli finish, import { colors, layout, typography } from '../styles/theme';
// TODO (Marie): Once finished, import CustomButton from '../components/CustomButton';

export default function CollectionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* FIXME: Apply typography.title style to this Text later */}
            <Text style={styles.header}>Media Collection</Text>
            
            {/* Build the global search bar. */}
            <TextInput 
                style={styles.input} 
                placeholder="Search catalog by title..." 
            />
            
            {/* FIXME: Swap this default Button for CustomButton later */}
            <Button title="Return to Home" onPress={() => navigation.goBack()} />
        </View>
    );
}

// ============================================================================
// TODO: THEME INTEGRATION GUIDE
// When Lauren and Sabelli finish the global theme, integrate it here using:
// 
// 1. Direct Assignment (for single properties like colors):
//    backgroundColor: colors.light.primary,
//
// 2. Spread Syntax (for grouped objects like layout or typography):
//    ...typography.buttonText,
//    ...layout.container,
// ============================================================================

const styles = StyleSheet.create({
    // FIXME: Replace this block with ...layout.container later
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 20 }
});