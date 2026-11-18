// File: app/screens/AddMediaScreen.js
// Purpose: Valid destination target for adding media with manual entry form and dynamic subtypes.

// SPRINT 2 TODO (Jaydine): Import the Expo image picker and file system libraries
// NOTE: FileSystem.documentDirectory saves images locally on the device,
// so photo_uri will only display on the /same phone/ where the item was added (can be changed in the future)

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';

// SPRINT 2 TODO (Ximena): Import checkDuplicateMedia from '../database/supabaseController'
import { addMediaItem } from '../database/supabaseController';
import { supabase } from '../database/supabase';

import { lightTheme } from '../styles/theme'; // Assuming lightTheme is exported globally like in EditScreen
import CustomButton from '../components/CustomButton';

const MEDIA_TYPES = ['Movie', 'Book', 'Music', 'VideoGame'];

// GENRE_MAP based on if the media is a movie, book, music, or video game
const GENRE_MAP = {
    Movie: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Documentary', 'Thriller'],
    Book: ['Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Biography', 'Sci-Fi', 'Romance'],
    Music: ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Country'],
    VideoGame: ['Action', 'RPG', 'Shooter', 'Strategy', 'Sports', 'Puzzle', 'Platformer']
};

// FORMAT INTEGRATION
// physical format options mapped by media type
const FORMAT_MAP = {
    Movie: ['DVD', 'Blu-ray', '4K UHD', 'VHS'],
    Book: ['Hardcover', 'Paperback'],
    Music: ['Vinyl', 'CD', 'Cassette'],
    VideoGame: ['Disc', 'Cartridge']
};

export default function AddMediaScreen({ navigation }) {
    // Main fields
    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [genre, setGenre] = useState('');
    const [format, setFormat] = useState('');
    const [releaseYear, setReleaseYear] = useState('');

    // SPRINT 2 TODO (Sabelli): Declare a state variable for 'rating' (default to null (NOT 0)).
    // SPRINT 2 TODO (Sabelli): Declare a state variable for 'review' (default to an empty string '')
    
    // Subtype fields
    const [director, setDirector] = useState('');
    const [author, setAuthor] = useState('');
    const [artist, setArtist] = useState('');
    const [developer, setDeveloper] = useState('');

    // SPRINT 2 TODO (Jaydine): Declare a state variable to store the selected photo's URI.

    // SPRINT 2 TODO (Jaydine): Create an asynchronous function to handle image selection:
    // 1. Request media library permissions from the user.
    // 2. Open the device's image library.
    // 3. IF the user selects an image (doesn't cancel):
    //    a. Extract the file name from the temporary image URI.
    //    b. Define a permanent path using the app's document directory + file name.
    //    c. Copy the file from the temporary URI to the new permanent path.
    //    d. Update your photo URI state variable with this permanent path.

    const handleSave = async () => {
        if (!title.trim() || !mediaType || !genre || !releaseYear.trim()) {
            Alert.alert('Missing Information', 'Title, Media Type, Genre, and Release Year cannot be blank.');
            return;
        }

        const yearInt = parseInt(releaseYear, 10);
        if (isNaN(yearInt)) {
            Alert.alert("Invalid Input", "Release Year must be a valid number.");
            return;
        }

        // Bundle the subtype data
        const subtypeData = {
            director: director.trim(),
            author: author.trim(),
            artist: artist.trim(),
            developer: developer.trim(),
            format: format || 'Unspecified'
        };

        try {

            // retrieve currntly authenticated user from supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                Alert.alert('Authentication Error', 'You must be logged in to save media.');
                return;
            }
            // SPRINT 2 TODO (Ximena): Rewrite the save flow below to handle duplicate checking.
            // Note: 'photoUri', 'rating', and 'review' state variables will be added by Jaydine and Sabelli.
            // You MUST include them in your addMediaItem calls!
            // Argument order: (title, mediaType, genre, releaseYear, subtypeData, userId, photoUri, rating, review, copyNumber)
            
            // 1. Await checkDuplicateMedia(user.id, title.trim(), mediaType).

            // 2. IF a duplicate is found:
            //   a. Trigger Alert.alert("Duplicate Found", "This item already exists in your collection.")
            //   b. Add "Cancel" button (aborts save)
            //   c. Add "Add Anyway" button. Inside its onPress:
            //      - Calculate new copy number (duplicate.copy_number + 1).
            //      - Await addMediaItem(title.trim(), mediaType, genre, yearInt, subtypeData, user.id, photoUri, rating, review, newCopyNumber)
            //      - Navigate goBack().

            // 3. ELSE (no duplicate):
            //      - Await addMediaItem(title.trim(), mediaType, genre, yearInt, subtypeData, user.id, photoUri, rating, review, 1)
            //      - Show success alert and navigate goBack().

            // SPRINT 2 TODO (Ximena): Remove the below code inside this try block once the above has been implemented.
            const mediaId = await addMediaItem(title.trim(), mediaType, genre, yearInt, subtypeData, user.id);
            
            console.log(`\n=== NEW ITEM SAVED: ID ${mediaId} ===`);
            Alert.alert('Success', 'Media saved successfully!', [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error saving media:', error);
            Alert.alert('Error', 'Could not save media to the database.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.header}>Add New Media</Text>

            {/* SPRINT 2 TODO (Jaydine): Add a touchable UI element here to trigger the image picker function. */}
            {/* IF the photo URI state has a value: render the Image component using that URI. */}
            {/* ELSE: render a placeholder square or camera icon. */}

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor={lightTheme.colors.secondaryText}
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Media Type</Text>
            <View style={styles.chipContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                    {MEDIA_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.chip, mediaType === type && styles.activeChip]}
                            onPress={() => {
                                setMediaType(type);
                                setGenre(''); // Clear the genre if the media type changes
                                setFormat(''); // clear the format if the media type changes
                            }}
                        >
                            <Text style={[styles.chipText, mediaType === type && styles.activeChipText]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.label}>Genre</Text>
            <View style={styles.chipContainer}>
                {mediaType ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                        {GENRE_MAP[mediaType].map((g) => (
                            <TouchableOpacity
                                key={g}
                                style={[styles.chip, genre === g && styles.activeChip]}
                                onPress={() => setGenre(g)}
                            >
                                <Text style={[styles.chipText, genre === g && styles.activeChipText]}>
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={{ marginLeft: 4, color: lightTheme.colors.secondaryText, fontStyle: 'italic' }}>
                        Please select a Media Type first.
                    </Text>
                )}
            </View>

            {/* FORMAT INTEGRATION */}
            <Text style={styles.label}>Format</Text>
            <View style={styles.chipContainer}>
                {mediaType ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                        {FORMAT_MAP[mediaType].map((f) => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.chip, format === f && styles.activeChip]}
                                onPress={() => setFormat(f)}
                            >
                                <Text style={[styles.chipText, format === f && styles.activeChipText]}>
                                    {f}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={{ marginLeft: 4, color: lightTheme.colors.secondaryText, fontStyle: 'italic' }}>
                        Please select a Media Type first.
                    </Text>
                )}
            </View>

            <Text style={styles.label}>Release Year</Text>
            <TextInput
                style={styles.input}
                placeholder="Release Year (e.g., 2024)"
                placeholderTextColor={lightTheme.colors.secondaryText}
                value={releaseYear}
                onChangeText={setReleaseYear}
                keyboardType="numeric"
            />

            {/* Conditionally render subtype fields based on mediaType */}
            {mediaType === 'Movie' && (
                <>
                    <Text style={styles.label}>Director</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Director"
                        placeholderTextColor={lightTheme.colors.secondaryText}
                        value={director}
                        onChangeText={setDirector}
                    />
                </>
            )}

            {mediaType === 'Book' && (
                <>
                    <Text style={styles.label}>Author</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Author"
                        placeholderTextColor={lightTheme.colors.secondaryText}
                        value={author}
                        onChangeText={setAuthor}
                    />
                </>
            )}

            {mediaType === 'Music' && (
                <>
                    <Text style={styles.label}>Artist</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Artist"
                        placeholderTextColor={lightTheme.colors.secondaryText}
                        value={artist}
                        onChangeText={setArtist}
                    />
                </>
            )}

            {mediaType === 'VideoGame' && (
                <>
                    <Text style={styles.label}>Developer</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Developer"
                        placeholderTextColor={lightTheme.colors.secondaryText}
                        value={developer}
                        onChangeText={setDeveloper}
                    />
                </>
            )}

            {/* SPRINT 2 TODO (Sabelli): Build a touchable Star Rating UI component here (1 to 5 stars). */}
            {/* Bind it to your 'rating' state variable. */}
            
            {/* SPRINT 2 TODO (Sabelli): Build a multiline <TextInput> below the stars for the written review. */}
            {/* Bind it to your 'review' state variable. */}

            <View style={styles.buttonGroup}>
                <CustomButton title="Save Item" onPress={handleSave} />
                <View style={{ height: 10 }} />
                <CustomButton title="Cancel" onPress={() => navigation.goBack()} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightTheme.colors.background
    },
    scrollContent: {
        padding: lightTheme.spacing.lg,
        paddingBottom: 40,
    },
    header: {
        fontSize: lightTheme.typography.title,
        fontWeight: 'bold',
        marginBottom: lightTheme.spacing.lg,
        color: lightTheme.colors.text,
        textAlign: 'center',
        marginTop: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: lightTheme.colors.text,
        marginBottom: 6,
        marginLeft: 4
    },
    input: {
        width: '100%',
        padding: lightTheme.spacing.md,
        borderWidth: 1,
        borderColor: lightTheme.colors.border,
        borderRadius: lightTheme.radius.md,
        marginBottom: lightTheme.spacing.lg,
        color: lightTheme.colors.text,
        backgroundColor: lightTheme.colors.surface
    },
    chipContainer: {
        marginBottom: lightTheme.spacing.lg,
        marginHorizontal: -lightTheme.spacing.lg,
    },
    chipScroll: {
        paddingHorizontal: lightTheme.spacing.lg,
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: lightTheme.radius.full || 50,
        backgroundColor: lightTheme.colors.surface,
        borderWidth: 1,
        borderColor: lightTheme.colors.border,
    },
    activeChip: {
        backgroundColor: lightTheme.colors.primary,
        borderColor: lightTheme.colors.primary,
    },
    chipText: {
        fontSize: 14,
        color: lightTheme.colors.secondaryText,
    },
    activeChipText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    buttonGroup: {
        marginTop: 10
    }
});
