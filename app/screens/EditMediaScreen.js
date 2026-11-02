// File: app/screens/EditMediaScreen.js
// Purpose: Valid destination target for editing media details with functional backward navigation.
// Author: Ximena Bustos
// External Sources: Gemini (Code Template)

import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
// TODO (Ximena): Once Lauren and Sabelli finish, import { colors, layout, typography } from '../styles/theme';
// TODO (Ximena): Once finished, import CustomButton from '../components/CustomButton';

export default function EditMediaScreen({ navigation }) {
    
    // TODO (Ximena): Build the mandated deletion confirmation dialog using Alert.alert.
    const confirmDelete = () => {
        // 1. Create an Alert with the title "Delete Media".
        // 2. Set the message to "Are you sure you want to permanently delete this item?".
        // 3. Add an array of button objects:
        //    - A "Cancel" button with the style "cancel".
        //    - A "Delete" button with the style "destructive". 
        //      - For the Delete button's onPress, use console.log("Item deleted") for now (database hookup will happen in a future sprint).
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit Item</Text>
            
            {/* TODO (Ximena): Build placeholder inputs for updating existing data. */}
            {/* 1. Add a TextInput for "Update Title" and apply the styles.input object. */}
            
            {/* TODO (Ximena): Build the Save, Delete, and Return buttons. */}
            {/* 1. Add a standard React Native <Button> for "Save Changes". */}
            {/* 2. Add a standard <Button> for "Delete Item". Wire its onPress to your confirmDelete function. Give it a red color prop. */}
            {/* 3. Add a standard <Button> for "Return to Home". Wire its onPress event to trigger navigation.goBack(). */}
            
            {/* TODO (Ximena): When Sabelli's CustomButton is ready, replace your standard <Button /> components using this syntax:
                <CustomButton title="Save Changes" onPress={() => {}} /> 
            */}
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
    // TODO (Ximena): Replace this block with ...layout.container later
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', padding: 10, borderWidth: 1, marginBottom: 15 }
});