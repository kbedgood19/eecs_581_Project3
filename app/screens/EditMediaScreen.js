// File: app/screens/EditMediaScreen.js
// Purpose: Valid destination target for editing media details with functional backward navigation.

// SPRINT 2 TODO (Jaydine): Import the Expo image picker, file system, and Image components.

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { lightTheme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

// Marie: SUPABASE INTEGRATION
// SPRINT 2 TODO (Ximena): Also import checkDuplicateMedia from '../database/supabaseController'
import { getMediaItemById, updateMediaItem, deleteMediaItem, getMediaCatalog } from '../database/supabaseController';
import { supabase } from '../database/supabase';

// GENRE_MAP based on if the item is a movie, book, music, or a video game
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

export default function EditMediaScreen({ route, navigation }) {
    const { mediaId } = route.params;

    // Main fields
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [format, setFormat] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [mediaType, setMediaType] = useState('');

    // SPRINT 2 TODO (Sabelli): Declare a state variable for 'rating' (default to null)
    // SPRINT 2 TODO (Sabelli): Declare a state variable for 'review' (default to empty string)
    
    // Subtype fields
    const [director, setDirector] = useState('');
    const [author, setAuthor] = useState('');
    const [artist, setArtist] = useState('');
    const [developer, setDeveloper] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    // SPRINT 2 TODO (Jaydine): Declare a state variable to hold the photo URI.

    useEffect(() => {
        async function loadMediaDetails() {
            try {
                const item = await getMediaItemById(mediaId);
                
                // Logs exactly what was fetched so you can verify in your VS Code terminal
                console.log(`\n=== LOADING ITEM ID ${mediaId} INTO EDIT SCREEN ===`);
                console.log(item); 
                
                if (item) {
                    setTitle(item.title || '');
                    setGenre(item.genre || '');
                    setFormat(item.format_name && item.format_name !== 'Unspecified' ? item.format_name : '');
                    setMediaType(item.type_name || '');
                    
                    // Explicit null checks ensure numbers parse correctly
                    setReleaseYear(item.releaseYear != null ? item.releaseYear.toString() : '');
                    
                    // Explicit null checks for all subtypes
                    setDirector(item.director != null ? item.director : '');
                    setAuthor(item.author != null ? item.author : '');
                    setArtist(item.artist != null ? item.artist : '');
                    setDeveloper(item.developer != null ? item.developer : '');

                    // SPRINT 2 TODO (Jaydine): If item.photo_uri exists, 
                    // update the photo URI state variable so the existing image loads.

                    // SPRINT 2 TODO (Sabelli): Check if item.rating exists. If so, update your rating state.
                    // SPRINT 2 TODO (Sabelli): Check if item.review exists. If so, update your review state.

                }
            } catch (error) {
                console.error("Failed to load item:", error);
                Alert.alert("Error", "Could not load media details.");
            } finally {
                setIsLoading(false);
            }
        }
        loadMediaDetails();
    }, [mediaId]);

    // SPRINT 2 TODO (Jaydine): Implement the same asynchronous image picker function used in AddMediaScreen here.

    const handleSave = async () => {
        if (!title.trim() || !genre || !releaseYear.trim()) {
            Alert.alert("Missing Information", "Title, Genre, and Release Year cannot be blank.");
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
            format: format
        };

        

        try {

            // Marie: SUPABASE INTEGRATION
            // retrieve currently authenticated user from supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                Alert.alert('Authentication Error', 'You must be logged in to save media.');
                return;
            }

            // SPRINT 2 TODO (Ximena): Rewrite the save flow below to handle duplicate checking.
            // Note: 'photoUri', 'rating', and 'review' state variables will be added by Jaydine and Sabelli.
            // You MUST include them as the 7th, 8th, and 9th arguments in your update calls!
            // Argument order: (id, title, genre, releaseYear, typeName, subtypeData, photoUri, rating, review)

            // 1. Await checkDuplicateMedia(user.id, title.trim(), mediaType).
            
            // 2. IF duplicate found AND duplicate.id !== mediaId:
            //   a. Trigger Alert.alert("Duplicate Found", "Another item with this title already exists.")
            //   b. Add "Cancel" button (aborts update)
            //   c. Add "Update Anyway" button. Inside its onPress:
            //      - Await updateMediaItem(mediaId, title.trim(), genre, yearInt, mediaType, subtypeData, photoUri, rating, review)
            //      - Navigate goBack().

            // 3. ELSE (no duplicate found, or the match is this exact item):
            //      - Await updateMediaItem(mediaId, title.trim(), genre, yearInt, mediaType, subtypeData, photoUri, rating, review)
            //      - Show success alert and navigate goBack().

            // SPRINT 2 TODO (Ximena): Remove the below code inside this try block once the above has been implemented.
            await updateMediaItem(mediaId, title.trim(), genre, yearInt, mediaType, subtypeData);
            Alert.alert("Success", "Media item updated successfully.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Failed to update item:", error);
            Alert.alert("Error", "Could not save changes to the database.");
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Media",
            "Are you sure want to permanently delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            
                            // Marie: SUPABASE INTEGRATION
                            const { data: { user }, error: userError } = await supabase.auth.getUser();

                            if (userError || !user) {
                                Alert.alert("Authentication Error", "You must be logged in to delete media.");
                                return;
                            }
                            
                            // Call the database function
                            await deleteMediaItem(mediaId);

                            // Log the deletion confirmation
                            console.log(`\n=== ITEM DELETED: ID ${mediaId} ===`);
                            
                            // SUPABASE INTEGRATION
                            // Fetch the updated database for the logged-in user and log it to the terminal
                            const updatedCatalog = await getMediaCatalog(user.id);
                            console.log("Updated Database Catalog:");
                            console.log(JSON.stringify(updatedCatalog, null, 2));
                            console.log("===================================\n");


                            // Navigate back after successful deletion
                            navigation.goBack(); 

                         } catch (error) {
                                console.error("Failed to delete item:", error);
                                Alert.alert("Error", "Could not delete the item from the database.");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={lightTheme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.header}>Edit {mediaType}</Text>
            
            {/* SPRINT 2 TODO (Jaydine): Insert the touchable image picker UI here. */}
            {/* Ensure it displays the currently saved photo URI state so the user sees their existing image! */}

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor={lightTheme.colors.secondaryText}
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Genre</Text>
            <View style={styles.chipContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                    {/* Maps over the specific array for this media type */}
                    {(GENRE_MAP[mediaType] || []).map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[
                                styles.chip,
                                genre === g && styles.activeChip
                            ]}
                            onPress={() => setGenre(g)}
                        >
                            <Text style={[
                                styles.chipText,
                                genre === g && styles.activeChipText
                            ]}>
                                {g}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* FORMAT INTEGRATION */}
            <Text style={styles.label}>Format</Text>
            <View style={styles.chipContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                    {(FORMAT_MAP[mediaType] || []).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.chip,
                                format === f && styles.activeChip
                            ]}
                            onPress={() => setFormat(f)}
                        >
                            <Text style={[
                                styles.chipText,
                                format === f && styles.activeChipText
                            ]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.label}>Release Year</Text>
            <TextInput
                style={styles.input}
                placeholder="Release Year"
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

            {/* SPRINT 2 TODO (Sabelli): Insert your Star Rating UI and multiline TextInput here. */}
            {/* Ensure they display the currently saved rating and review state variables so the user sees their existing feedback! */}

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Save Changes"
                    onPress={handleSave}
                />
                <View style={{ height: 10 }} /> 
                <CustomButton
                    title="Delete Item"
                    onPress={confirmDelete}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: lightTheme.colors.background,
    },
    scrollContent: {
        padding: lightTheme.spacing.lg,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightTheme.colors.background,
    },
    header: { 
        fontSize: lightTheme.typography.title, 
        fontWeight: 'bold', 
        color: lightTheme.colors.text,
        marginBottom: lightTheme.spacing.lg,
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
        backgroundColor: lightTheme.colors.surface,
        color: lightTheme.colors.text,
        marginBottom: lightTheme.spacing.lg
    },
    // Genre Chips
    chipContainer: {
        marginBottom: lightTheme.spacing.lg,
        marginHorizontal: -lightTheme.spacing.lg, // Allows edge-to-edge scrolling
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
    buttonContainer: {
        marginTop: 20
    }
});