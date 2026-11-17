// File: app/screens/CollectionScreen.js
// Purpose: Main catalog view with search, filtering, and media display.

import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    FlatList,
    ActivityIndicator
    // SPRINT 2 TODO (Jaydine): Import the Image component from 'react-native' here.
} from 'react-native';


import { Search } from 'lucide-react-native';
import { getTheme } from '../styles/theme';
import { getMediaCatalog } from '../database/controller'; 

export default function CollectionScreen({ navigation, route }) {
    const isDarkMode = false;
    const theme = getTheme(isDarkMode);
    const styles = createStyles(theme);

    const initialQuery = route.params?.initialQuery || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeFilter, setActiveFilter] = useState('All');

    const [sortBy, setSortBy] = useState('title_asc');
    const [formatFilter, setFormatFilter] = useState('All');

    // SPRINT 2 TODO (Greeshma): Declare a state variable for 'sortBy' (default to 'title_asc').
    // SPRINT 2 TODO (Greeshma): Declare a state variable for 'formatFilter' (default to 'All').
    
    // New state for database data
    const [mediaItems, setMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const filters = ['All', 'Movies', 'Music', 'Books', 'Video Games'];

    const sortOptions = [
        { label: 'Title A-Z', value: 'title_asc' },
        { label: 'Newest', value: 'date_added' },
        { label: 'Highest Rated', value: 'rating_desc' }
    ];

const formatOptions = ['All', 'DVD', 'Blu-ray', 'Digital', 'Unspecified'];

    // Re-fetch data whenever the screen comes into focus OR filters change
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function loadMedia() {
                setIsLoading(true);
                try {
                    // SPRINT 2 TODO (Greeshma): Update this controller call to pass your new filter variables.
                    // Expected argument order: (userId, searchQuery, filterType, sortBy, formatFilter)
                    // Note: Use 'test-user-123' for the userId until Supabase auth is fully connected!

                    const data = await getMediaCatalog(
                        'test-user-123',
                        searchQuery,
                        activeFilter,
                        sortBy,
                        formatFilter
                    );
                } catch (error) {
                    console.error("Failed to fetch media:", error);
                } finally {
                    if (isActive) {
                        setIsLoading(false);
                    }
                }
            }
            
            const delaySearch = setTimeout(() => {
                loadMedia();
            }, 300);

            return () => {
                clearTimeout(delaySearch);
                isActive = false; // prevents state updates if screen is unmounted
            };
        
        // SPRINT 2 TODO (Greeshma): Add your 'sortBy' and 'formatFilter' state variables into this array bracket.
        // This ensures the screen immediately re-fetches the list whenever a user changes a sort/filter option!
        }, [searchQuery, activeFilter, sortBy, formatFilter])
    );

    // UI for a single media item card
    const renderMediaCard = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('EditMedia', { mediaId: item.id })}
        >
            {/* SPRINT 2 TODO (Jaydine): Wrap the image and the existing text content (cardContent) below inside a row-based container so they sit side-by-side. */}
            {/* IF item.photo_uri exists: Render the Image component pointing to that URI. */}
            {/* ELSE: Render a default placeholder view/icon. */}

            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardMeta}>
                    <Text style={styles.cardTypeText}>{item.type_name}</Text>
                    {item.genre && (
                        <>
                            <Text style={styles.dotSeparator}>•</Text>
                            <Text style={styles.cardSubtext}>{item.genre}</Text>
                        </>
                    )}
                    {item.releaseYear && (
                        <>
                            <Text style={styles.dotSeparator}>•</Text>
                            <Text style={styles.cardSubtext}>{item.releaseYear}</Text>
                        </>
                    )}

                    {/* SPRINT 2 TODO (Sabelli): Conditionally render the user's rating here. */}
                    {/* IF item.rating is not null: */}
                    {/*    1. Render a dot separator <Text style={styles.dotSeparator}>•</Text> */}
                    {/*    2. Render a Text component displaying a star icon and the score (e.g., "★ 4/5"). */}
                    {/* ELSE: render nothing. */}

                </View>
            </View>
        </TouchableOpacity>
    );

    // Empty state UI extracted for the FlatList
    const ListEmptyComponent = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items found.</Text>
            <Text style={styles.emptySubtext}>
                Try adjusting your filters or adding new media to your catalog.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={theme.colors.background}
            />

            {/* SEARCH BAR */}
            <View style={styles.searchContainer}>
                <Search size={21} color={theme.colors.secondaryText} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search catalog by title..."
                    placeholderTextColor={theme.colors.secondaryText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
            </View>

            {/* FILTERS */}
            <View style={styles.filterSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterChip,
                                activeFilter === filter && styles.activeFilterChip
                            ]}
                            onPress={() => setActiveFilter(filter)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === filter && styles.activeFilterText
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* SPRINT 2 TODO (Greeshma): Build the UI controls for Sorting and Format Filtering here. */}
            {/* SORTING OPTIONS */}
            <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Sort by</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.filterChip,
                                sortBy === option.value && styles.activeFilterChip
                            ]}
                            onPress={() => setSortBy(option.value)}
                        >
                            <Text style={[
                                styles.filterText,
                                sortBy === option.value && styles.activeFilterText
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                     ))}
                 </ScrollView>
             </View>
            {/* You can use horizontal ScrollViews with touchable chips (like the media type filters above), */}
            {/* or standard React Native <Picker> components, or a popup Modal. */}
            {/* Make sure their values are bound to your 'sortBy' and 'formatFilter' state variables! */}

            {/* MEDIA LIST */}
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={mediaItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMediaCard}
                    ListEmptyComponent={ListEmptyComponent}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
}

/* ================= STYLES ================= */
const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius?.md || 8, // fallback if theme prop doesn't exist
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 12,
        marginHorizontal: theme.spacing?.lg || 16,
        marginTop: theme.spacing?.lg || 16,
        marginBottom: theme.spacing?.md || 12,
    },
    searchInput: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 14,
        paddingVertical: 14,
        paddingLeft: 8,
    },
    filterSection: {
        marginBottom: theme.spacing?.md || 12,
    },
    filterScroll: {
        paddingHorizontal: theme.spacing?.lg || 16,
        gap: 10,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: theme.radius?.full || 50,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    activeFilterChip: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.secondaryText,
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    listContainer: {
        flexGrow: 1,
        padding: theme.spacing?.lg || 16,
        gap: 12, // Spaces out the cards
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius?.lg || 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 40,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 13,
        color: theme.colors.secondaryText,
        textAlign: 'center',
        lineHeight: 20,
    },

    // SPRINT 2 TODO (Jaydine): Define strict styling for the card image here. 
    // It requires fixed dimensions (e.g., width: 60, height: 90) and a resize mode of 'cover'.
    // This ensures that massive, high-resolution camera photos don't break the FlatList layout.

    // New Card Styles
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius?.md || 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 16,
        marginBottom: 10,
    },
    cardContent: {
        flexDirection: 'column',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    cardTypeText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    cardSubtext: {
        fontSize: 12,
        color: theme.colors.secondaryText,
    },
    dotSeparator: {
        fontSize: 12,
        color: theme.colors.secondaryText,
        marginHorizontal: 6,
    }
});
