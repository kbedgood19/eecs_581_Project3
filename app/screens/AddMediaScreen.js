// File: app/screens/AddMediaScreen.js
// Purpose: Valid destination target for adding media with manual entry form boilerplate and backward navigation.
// Author: Greeshma Kunduri
// External Sources: Gemini (Code Template)

import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert
} from 'react-native';

import { getTheme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

export default function AddMediaScreen({ navigation, isDarkMode = false }) {

    const theme = getTheme(isDarkMode);
    const styles = createStyles(theme);

    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [genre, setGenre] = useState('');

    const handleSave = () => {
        if (!title.trim() || !mediaType.trim() || !genre.trim()) {
            Alert.alert(
                'Missing Information',
                'Please fill in all fields.'
            );
            return;
        }

        Alert.alert(
            'Success',
            'Media information entered successfully!'
        );
    };

    return (
        <View style={styles.container}>

            <Text style={styles.header}>Add New Media</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor={theme.colors.secondaryText}
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Media Type (e.g., DVD)"
                placeholderTextColor={theme.colors.secondaryText}
                value={mediaType}
                onChangeText={setMediaType}
            />

            <TextInput
                style={styles.input}
                placeholder="Genre"
                placeholderTextColor={theme.colors.secondaryText}
                value={genre}
                onChangeText={setGenre}
            />

            <View style={styles.buttonGroup}>

                <CustomButton
                    title="Save Item"
                    onPress={handleSave}
                    isDarkMode={isDarkMode}
                />

                <CustomButton
                    title="Cancel"
                    onPress={() => navigation.goBack()}
                    isDarkMode={isDarkMode}
                />

            </View>

        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background
    },

    header: {
        fontSize: theme.typography.title,
        fontWeight: 'bold',
        marginBottom: theme.spacing.lg,
        color: theme.colors.text
    },

    input: {
        width: '100%',
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface
    },

    buttonGroup: {
        width: '100%',
        flexDirection: 'column',
        marginTop: theme.spacing.sm
    }

});
