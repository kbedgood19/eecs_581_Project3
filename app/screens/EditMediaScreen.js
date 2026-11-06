// File: app/screens/EditMediaScreen.js
// Purpose: Valid destination target for editing media details with functional backward navigation.
// Author: Ximena Bustos
// External Sources: Gemini (Code Template)

import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
// TODO (Ximena): Once Lauren and Sabelli finish, import { colors, layout, typography } from '../styles/theme';
// Imports the global light theme
import { lightTheme } from '../styles/theme';
// TODO (Ximena): Once finished, import CustomButton from '../components/CustomButton';

export default function EditMediaScreen({ navigation }) {
    
    // TODO (Ximena): Build the mandated deletion confirmation dialog using Alert.alert.
    // Displays a confirmation dialog before deleting a media item
    const confirmDelete = () => {
        // 1. Create an Alert with the title "Delete Media".
        // 2. Set the message to "Are you sure you want to permanently delete this item?".
        // 3. Add an array of button objects:
        //    - A "Cancel" button with the style "cancel".
        //    - A "Delete" button with the style "destructive". 
        //      - For the Delete button's onPress, use console.log("Item deleted") for now (database hookup will happen in a future sprint).
        Alert.alert(
            "Delete Media",
            "Are you sure want to permanently delete this item?",
            [
                {
                    // Closes the dialog without deleting anything
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    // Placeholder for future database deletion
                    text: "Delete",
                    style: "destructive",
                    onPress: () => console.log("Item deleted")
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Displays the Edit Media screen heading */}
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
            {/* Placeholder input for updating the media title */}
            <TextInput
                style={styles.input}
                placeholder="Update Title"
                placeholderTextColor={lightTheme.colors.secondaryText}
            />

            {/* Placeholder for saving edited media information. */}
            <Button
                title="Save Changes"
                color={lightTheme.colors.primary}
                onPress={() => {
                    Alert.alert(
                        "Not Available"
                    );
                }}
            />

            {/* Opens the deletion confirmation dialog */}
            <Button
                title="Delete Item"
                color={lightTheme.colors.danger}
                onPress={confirmDelete}
            />

            {/* Returns to the previous screen. */}
            <Button
                title="Return to Home"
                color={lightTheme.colors.primary}
                onPress={() => navigation.goBack()}
            />

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
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: lightTheme.colors.background,
        padding: lightTheme.spacing.lg
    },

    header: { 
        fontSize: lightTheme.typography.title, 
        fontWeight: 'bold', 
        color: lightTheme.colors.text,
        marginBottom: lightTheme.spacing.lg
    },

    input: { 
        width: '100%', 
        padding: lightTheme.spacing.md, 
        borderWidth: 1, 
        borderColor: lightTheme.colors.border,
        borderRadius: lightTheme.radius.md,
        backgroundColor: lightTheme.colors.surface,
        color: lightTheme.colors.text,
        marginBottom: lightTheme.spacing.md
    }
});