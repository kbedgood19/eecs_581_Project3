// File: app/screens/AddMediaScreen.js
// Purpose: Valid destination target for adding media with manual entry form boilerplate and backward navigation.
// Author: Greeshma Kunduri
// External Sources: Gemini (Code Template)

import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// TODO (Greeshma): Once Lauren and Sabelli finish, import { colors, layout, typography } from '../styles/theme';
// TODO (Greeshma): Once finished, import CustomButton from '../components/CustomButton';

export default function AddMediaScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Media</Text>
            
            {/* TODO (Greeshma): Construct manual entry forms for basic metadata. */}
            {/* 1. Add a TextInput for "Title" and apply the styles.input object. */}
            {/* 2. Add a TextInput for "Media Type (e.g., DVD)" and apply styles.input. */}
            {/* 3. Add a TextInput for "Genre" and apply styles.input. */}
            
            <View style={styles.buttonGroup}>
                {/* TODO (Greeshma): Build the Save and Cancel buttons. */}
                {/* 1. Add a standard React Native Save <Button>. */}
                {/* 2. Add a standard Cancel <Button>. Wire its onPress event to trigger navigation.goBack(). */}
                
                {/* TODO (Greeshma): When Sabelli's CustomButton is ready, replace your standard <Button /> components using this syntax:
                    <CustomButton title="Save Item" onPress={() => {}} /> 
                */}
            </View>
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
    // TODO (Greeshma): Replace this block with ...layout.container later
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', padding: 10, borderWidth: 1, marginBottom: 15 },
    buttonGroup: { flexDirection: 'row', gap: 15 }
});