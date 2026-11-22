// File: app/screens/AddMediaScreen.js
// Purpose: Valid destination target for adding media with manual entry form and dynamic subtypes.

// SPRINT 2 TODO (Jaydine): Import the Expo image picker and file system libraries
import * as ImagePicker from 'expo-image-picker'; //open the photo library
import { File, Paths } from 'expo-file-system'; //save photos on the phone

//note: Paths.document saves images locally on the device
// so photo_uri will only display on the /same phone/ where the item was added (can be changed in the future)

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';

// SPRINT 2 TODO (Ximena): Import checkDuplicateMedia from '../database/supabaseController'
import { addMediaItem, checkDuplicateMedia } from '../database/supabaseController';
import { supabase } from '../database/supabase';

import { lightTheme } from '../styles/theme'; // Assuming lightTheme is exported globally like in EditScreen
import CustomButton from '../components/CustomButton';
import { Star } from 'lucide-react-native'; //star icons for the rating

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

const STAR_COLOR = '#F5B400'; //gold color for the stars -sa

export default function AddMediaScreen({ navigation }) {
    // Main fields
    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [genre, setGenre] = useState('');
    const [format, setFormat] = useState('');
    const [releaseYear, setReleaseYear] = useState('');

    // SPRINT 2 TODO (Sabelli): Declare a state variable for 'rating' (default to null (NOT 0)).
    const [rating, setRating] = useState(null); //1 to 5 stars, null means no rating yet
    // SPRINT 2 TODO (Sabelli): Declare a state variable for 'review' (default to an empty string '')
    const [review, setReview] = useState(''); //written review
    
    // Subtype fields
    const [director, setDirector] = useState('');
    const [author, setAuthor] = useState('');
    const [artist, setArtist] = useState('');
    const [developer, setDeveloper] = useState('');

    // SPRINT 2 TODO (Jaydine): Declare a state variable to store the selected photo's URI.
    const [photoUri, setPhotoUri] = useState(null); //store the selected photo's location

    // SPRINT 2 TODO (Jaydine): Create an asynchronous function to handle image selection:
    // 1. Request media library permissions from the user.
    // 2. Open the device's image library.
    // 3. IF the user selects an image (doesn't cancel):
    //    a. Extract the file name from the temporary image URI.
    //    b. Define a permanent path using the app's document directory + file name.
    //    c. Copy the file from the temporary URI to the new permanent path.
    //    d. Update your photo URI state variable with this permanent path.
    const pickPhoto = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); //request photo access

            if (!permission.granted) {
                Alert.alert('Permission Required', 'Please allow photo access in your phone settings.');
                return; //stop if permission was denied
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], //only show photos
                allowsEditing: true, //allow cropping
                quality: 0.8 //reduce the saved image size
            });

            if (result.canceled || !result.assets?.length) {
                return; //keep the current photo if the user cancels
            }

            const source = new File(result.assets[0].uri); //get the selected photo
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${source.name}`; //create a unique file name
            const savedPhoto = new File(Paths.document, fileName); //choose a lasting location

            await source.copy(savedPhoto); //save a copy on the phone
            setPhotoUri(savedPhoto.uri); //update the selected photo
        } catch (error) {
            console.error('Photo selection failed:', error); //show the error in the terminal
            Alert.alert('Photo Error', 'Could not attach the photo. Please try again.');
        }
    };

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

            // Checks wheher this item already exists in the user's collection
            const duplicate = await checkDuplicateMedia(
                user.id,
                title.trim(),
                mediaType
            );

            // Helper function to save the item with the specified copy number
            const saveItem = async (copyNumber) => {
                try {
                    const mediaId = await addMediaItem(
                        title.trim(),
                        mediaType,
                        genre,
                        yearInt,
                        subtypeData,
                        user.id,
                        photoUri,
                        rating, //star rating or null
                        review.trim(), //written review
                        copyNumber
                    );
                    console.log(`\n=== NEW ITEM SAVED: ID ${mediaId} ===`);

                    Alert.alert('Success', 'Media saved successfully!', [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ]);
                } catch (error) {
                    console.error('Error saving media:', error);
                    Alert.alert('Error', 'Could not save media to the database.');
                }
            };

            // If a matching item exists, ask the user before adding another copy
            if (duplicate) {
                const newCopyNumber = Number(duplicate.copy_number || 1) + 1;
                Alert.alert(
                    'Duplicate Found',
                    'This item already exists in your collection. Would you like to add another copy?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Add Anyway',
                            onPress: () => saveItem(newCopyNumber)
                        }
                    ]
                );
            } else {
                // No duplicate exists, so add it as the first copy
                await saveItem(1);
            }
        } catch (error) {
            console.error('Error checking for duplicates:', error);
            Alert.alert('Error', 'Could not check for duplicate media.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.header}>Add New Media</Text>

            {/* SPRINT 2 TODO (Jaydine): Add a touchable UI element here to trigger the image picker function. */}
            {/* IF the photo URI state has a value: render the Image component using that URI. */}
            {/* ELSE: render a placeholder square or camera icon. */}

            <TouchableOpacity
                style={styles.photoPicker}
                onPress={pickPhoto}
                accessibilityRole="button"
                accessibilityLabel="Choose media photo"
            >
                {photoUri ? (
                    <Image
                        source={{ uri: photoUri }}
                        style={styles.photoPreview}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Text style={styles.photoText}>Attach a Photo</Text>
                    </View>
                )}

                <Text style={styles.photoText}>
                    {photoUri ? 'Tap to change photo' : 'Tap to choose a photo'}
                </Text>
            </TouchableOpacity>


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

            <Text style={styles.label}>Rating</Text>
            <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(rating === star ? null : star)}
                        accessibilityRole="button"
                        accessibilityLabel={`Rate ${star} out of 5`}
                    >
                        <Star
                            size={32}
                            color={STAR_COLOR}
                            fill={rating !== null && star <= rating ? STAR_COLOR : 'transparent'}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Review</Text>
            <TextInput
                style={[styles.input, styles.reviewInput]}
                placeholder="Write your thoughts about this item..."
                placeholderTextColor={lightTheme.colors.secondaryText}
                value={review}
                onChangeText={setReview}
                multiline
                textAlignVertical="top"
            />

            <View style={styles.buttonGroup}>
                <CustomButton title="Save Item" onPress={handleSave} />
                <View style={{ height: 10 }} />
                <CustomButton title="Cancel" onPress={() => navigation.goBack()} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    photoPicker: {
        alignItems: 'center',
        marginBottom: lightTheme.spacing.lg,
    },
    photoPreview: {
        width: 150,
        height: 200,
        borderRadius: lightTheme.radius.md,
    },
    photoPlaceholder: {
        width: 150,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: lightTheme.colors.border,
        borderRadius: lightTheme.radius.md,
        backgroundColor: lightTheme.colors.surface,
    },
    photoText: {
        color: lightTheme.colors.secondaryText,
        fontSize: 13,
        marginTop: 8,
        textAlign: 'center',
    },
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
    starRow: {
        flexDirection: 'row',
        gap: 8, //space between stars
        marginBottom: lightTheme.spacing.lg,
        marginLeft: 4
    },
    reviewInput: {
        minHeight: 100, //taller box for longer reviews
    },
    buttonGroup: {
        marginTop: 10   ``
    }
});
