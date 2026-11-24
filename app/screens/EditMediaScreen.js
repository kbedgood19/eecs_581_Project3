// File: app/screens/EditMediaScreen.js
// Purpose: Valid destination target for editing media details with functional backward navigation.

// SPRINT 2 TODO (Jaydine): Import the Expo image picker, file system, and Image components.
import * as ImagePicker from 'expo-image-picker'; //open the photo library
import { File, Paths } from 'expo-file-system'; //save photos on the phone
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';


// SPRINT 3 (Lauren)- REQUIREMENT 12
// PSEUDOCODE (IMPORTS):
// 1. REMOVE the static lightTheme import below
// 2. IMPORT useTheme from '../styles/ThemeContext'
import { lightTheme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

import { Star } from 'lucide-react-native'; //star icons for the rating


// Marie: SUPABASE INTEGRATION
// SPRINT 2 (Ximena): Also import checkDuplicateMedia from '../database/supabaseController'
import { getMediaItemById, updateMediaItem, deleteMediaItem, getMediaCatalog, checkDuplicateMedia } from '../database/supabaseController';
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
const STAR_COLOR = '#F5B400'; //gold color for the stars


// SPRINT 3 (Ximena) - VERIFY INPUT
// PSEUDOCODE (VALIDATION CONSTANTS & HELPERS):
// 1. DEFINE the same input limit constants used in AddMediaScreen:
//    - MIN_RELEASE_YEAR (e.g., 1000)
//    - MAX_RELEASE_YEAR (current year + 1)
//    - MAX_TITLE_LENGTH (e.g., 150)
//    - MAX_CREATOR_LENGTH (e.g., 100)
//    - MAX_REVIEW_LENGTH (e.g., 500)
// 2. DEFINE the same text normalization helper (trim + collapse repeated internal spaces)
//    - Note: Keep numbers and punctuation allowed in titles and creator names

export default function EditMediaScreen({ route, navigation }) {
    // SPRINT 3 (Lauren) - REQUIREMENT 12
    // PSEUDOCODE (CONNECT TO GLOBAL THEME):
    // 1. CALL the ThemeContext hook to retrieve the active theme object
    // 2. GENERATE the screen's styles object by passing the active theme into createStyles()
    
    const { mediaId } = route.params;

    // Main fields
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [format, setFormat] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [mediaType, setMediaType] = useState('');

    // SPRINT 2 (Sabelli): Declare a state variable for 'rating' (default to null)
    const [rating, setRating] = useState(null); //1 to 5 stars, null means no rating yet
    // SPRINT 2 (Sabelli): Declare a state variable for 'review' (default to empty string)
    const [review, setReview] = useState(''); //written review
    
    // Subtype fields
    const [director, setDirector] = useState('');
    const [author, setAuthor] = useState('');
    const [artist, setArtist] = useState('');
    const [developer, setDeveloper] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    // SPRINT 2 (Jaydine): Declare a state variable to hold the photo URI.
    const [photoUri, setPhotoUri] = useState(null); //store the selected photo's location


    // SPRINT 3 (Ximena) - VERIFY INPUT
    // PSEUDOCODE (DOUBLE-SUBMIT GUARD STATE):
    // 1. ADD an isSaving boolean state (default false) to prevent rapid taps on "Save Changes" from firing duplicate updates

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
                    setPhotoUri(item.photo_uri || null); //load the item's existing photo

                    // SPRINT 2 TODO (Sabelli): Check if item.rating exists. If so, update your rating state.
                    if (item.rating != null) setRating(Number(item.rating)); //load the saved rating
                    // SPRINT 2 TODO (Sabelli): Check if item.review exists. If so, update your review state.
                    if (item.review != null) setReview(item.review); //load the saved review

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

    // SPRINT 2 (Jaydine): Implement the same asynchronous image picker function used in AddMediaScreen here.
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
                return; //keep the existing photo if the user cancels
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



    // SPRINT 3 (Ximena) - VERIFY INPUT
    // PSEUDOCODE (FULL FORM VALIDATION BEFORE UPDATING):
    // 1. IF isSaving is true, RETURN early
    // 2. NORMALIZE title (trim + collapse extra spaces), trimmedYear, trimmedReview, and the active subtype field
    // 3. REQUIRED FIELDS CHECK:
    //    - Verify normalizedTitle, genre, format, and trimmedYear are all non-empty
    //    - (Note: legacy items saved as 'Unspecified' load with format='', so requiring format prompts the user to select a real format)
    //    - IF any are missing, show an Alert listing the missing fields and return
    // 4. VALID OPTION CHECK:
    //    - Verify genre exists in (GENRE_MAP[mediaType] || [])
    //    - Verify format exists in (FORMAT_MAP[mediaType] || [])
    // 5. STRICT RELEASE YEAR CHECK (replaces the loose parseInt check below):
    //    - Verify trimmedYear matches ONLY 4 numeric digits (e.g., /^\d{4}$/) so "2024abc", "2024.5", or "-2024" fail
    //    - Parse to integer and verify MIN_RELEASE_YEAR <= yearInt <= MAX_RELEASE_YEAR
    //    - IF invalid, show an Alert stating the valid year range and return
    // 6. LENGTH CHECKS:
    //    - IF normalizedTitle exceeds MAX_TITLE_LENGTH, show an Alert and return
    //    - IF the active subtype field (director/author/artist/developer) exceeds MAX_CREATOR_LENGTH, show an Alert and return
    //    - IF trimmedReview exceeds MAX_REVIEW_LENGTH, show an Alert and return (blank reviews must remain allowed)
    // 7. DEFENSIVE RATING CHECK:
    //    - IF rating is not null, verify it is a whole number between 1 and 5
    // 8. PASS normalizedTitle, trimmedReview, and normalized subtypeData into checkDuplicateMedia() and updateMediaItem()
    // 9. MANAGE isSaving:
    //    - Set isSaving(true) before the async try block
    //    - Reset isSaving(false) on errors, on duplicate Alert "Cancel", and after saveChanges finishes

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

            // SPRINT 2 (Ximena): Rewrite the save flow below to handle duplicate checking.
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
            
            // Checks whether another item with this title already exists
            const duplicate = await checkDuplicateMedia(
                user.id,
                title.trim(),
                mediaType
            );

            // Function to update the item
            const saveChanges = async () => {
                try {
                    await updateMediaItem(
                        mediaId,
                        title.trim(),
                        genre,
                        yearInt,
                        mediaType,
                        subtypeData,
                        photoUri,
                        rating, //star rating or null
                        review.trim() //written review
                    );
                    Alert.alert("Success", "Media item updated successfully.", [
                        {
                            text: "OK",
                            onPress: () => navigation.goBack()
                        }
                    ]);
                } catch (error) {
                    console.error("Failed to update item:", error);
                    Alert.alert("Error", "Could not save changes to the database.");
                }
            };

            // If another item has the same title, ask before updating
            if (duplicate && duplicate.id !== mediaId) {
                Alert.alert(
                    "Duplicate Found",
                    "Another item with this title already exists.",
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {
                            text: "Update Anyway",
                            onPress: saveChanges
                        }
                    ]
                );
            } else {
                // No duplicate found, or the match is this exact item.
                await saveChanges();
            }
        } catch (error) {
            console.error("Error checking for duplicates:", error);
            Alert.alert("Error", "Could not check for duplicate media.");
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
                {/* SPRINT 3 (Lauren) - REQUIREMENT 12
                    PSEUDOCODE (INLINE THEME REFERENCE):
                    Update ActivityIndicator color below to use the active theme's primary color */}
                <ActivityIndicator size="large" color={lightTheme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
            {/* SPRINT 3 (Lauren) - REQUIREMENT 12
                PSEUDOCODE (INLINE THEME REFERENCES):
                Update every TextInput placeholderTextColor below to read from the active theme object
                retrieved from ThemeContext instead of lightTheme */}
        
            
            {/* SPRINT 3 (Ximena) - VERIFY INPUT
                PSEUDOCODE (UI INPUT CONSTRAINTS & CLEANUP):
                1. ADD keyboardShouldPersistTaps="handled" to the ScrollView above
                2. ADD maxLength props to TextInputs:
                   - Title -> MAX_TITLE_LENGTH
                   - Release Year -> 4, AND inside onChangeText strip non-digit characters (replace /[^0-9]/g with '') before calling setReleaseYear
                   - Director, Author, Artist, Developer -> MAX_CREATOR_LENGTH
                   - Review -> MAX_REVIEW_LENGTH
                3. OPTIONAL: Display a small character counter below the Review TextInput (e.g., "{review.length} / {MAX_REVIEW_LENGTH}")
                4. WHILE isSaving is true, prevent pressing "Save Changes" again (e.g., update title to "Saving..." or show loading state)
                5. MINOR TEXT FIX: In confirmDelete above, fix "Are you sure want to..." -> "Are you sure you want to..." */}

            <Text style={styles.header}>Edit {mediaType}</Text>
            
            {/* SPRINT 2 (Jaydine): Insert the touchable image picker UI here. */}
            {/* Ensure it displays the currently saved photo URI state so the user sees their existing image! */}

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

            {/* SPRINT 2 (Sabelli): Insert your Star Rating UI and multiline TextInput here. */}
            {/* Ensure they display the currently saved rating and review state variables so the user sees their existing feedback! */}

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



// SPRINT 3 (Lauren) - REQUIREMENT 12
// PSEUDOCODE (CONVERT STATIC STYLES TO DYNAMIC THEME):
// 1. WRAP StyleSheet.create(...) below inside a createStyles(theme) function
// 2. REPLACE every reference to lightTheme inside this stylesheet with the theme parameter
// 3. Verify activeChipText maintains readable contrast on all 5 themes (e.g., theme.colors.surface or '#FFFFFF')
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
        color: '#FFFFFF', // SPRINT 3 (Lauren) - change to color: theme.colors.surface
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
    buttonContainer: {
        marginTop: 20
    }
});