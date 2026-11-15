// File: app/screens/AddMediaScreen.js
// Purpose: Valid destination target for adding media with manual entry form and dynamic subtypes.
// Author: Greeshma Kunduri

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { addMediaItem } from '../database/controller';
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

export default function AddMediaScreen({ navigation }) {
    // Main fields
    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    
    // Subtype fields
    const [director, setDirector] = useState('');
    const [author, setAuthor] = useState('');
    const [artist, setArtist] = useState('');
    const [developer, setDeveloper] = useState('');

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
            developer: developer.trim()
        };

        try {
            const mediaId = await addMediaItem(title.trim(), mediaType, genre, yearInt, subtypeData);
            
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
