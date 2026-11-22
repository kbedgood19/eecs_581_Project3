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
    ActivityIndicator,
    Image
} from 'react-native';

import { Search } from 'lucide-react-native';
import { getTheme } from '../styles/theme';

// Marie: SUPABASE INTEGRATION
import { getMediaCatalog } from '../database/supabaseController';
import { supabase } from '../database/supabase';

// Marie: FORMAT FILTER - physical format options mapped by collection media type filter
const FORMAT_MAP = {
    Movies: ['DVD', 'Blu-ray', '4K UHD', 'VHS'],
    Books: ['Hardcover', 'Paperback'],
    Music: ['Vinyl', 'CD', 'Cassette'],
    'Video Games': ['Disc', 'Cartridge']
};

export default function CollectionScreen({ navigation, route }) {
    const isDarkMode = false;
    const theme = getTheme(isDarkMode);
    const styles = createStyles(theme);

    const initialQuery = route.params?.initialQuery || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortBy, setSortBy] = useState('title_asc');
    const [formatFilter, setFormatFilter] = useState('All');

    // New state for database data
    const [mediaItems, setMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const filters = ['All', 'Movies', 'Music', 'Books', 'Video Games'];

    // Marie: FORMAT FILTER FIX - dynamically tie format chips to the active media type
    const formatOptions = activeFilter !== 'All'
        ? ['All', ...(FORMAT_MAP[activeFilter] || []), 'Unspecified']
        : [];

    // Marie: FORMAT FILTER FIX - reset format filter when switching media types
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setFormatFilter('All');
    };

    // Re-fetch data whenever the screen comes into focus OR filters change
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function loadMedia() {
                setIsLoading(true);
                try {
                    // Marie: SUPABASE INTEGRATION
                    const { data: { user }, error: userError } = await supabase.auth.getUser();

                    if (userError || !user) {
                        console.error("No logged-in user found:", userError?.message);
                        if (isActive) {
                            setMediaItems([]);
                        }
                        return;
                    }

                    // SUPABASE INTEGRATION
                    const data = await getMediaCatalog(
                        user.id,
                        searchQuery,
                        activeFilter,
                        sortBy,
                        formatFilter
                    );
                    if (isActive) {
                        setMediaItems(data);
                    }
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
        }, [searchQuery, activeFilter, sortBy, formatFilter])
    );

    // UI for a single media item card
    const renderMediaCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EditMedia', { mediaId: item.id })}
        >
            <View style={styles.cardRow}>
                {item.photo_uri ? (
                    <Image
                        source={{ uri: item.photo_uri }}
                        style={styles.cardImage}
                        resizeMode="cover"
                        accessibilityLabel={`Photo of ${item.title}`}
                    />
                ) : (
                    <View style={styles.cardImagePlaceholder}>
                        <Text style={styles.placeholderText}>No Photo</Text>
                    </View>
                )}

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

                        {item.rating != null && (
                            <>
                                <Text style={styles.dotSeparator}>•</Text>
                                <Text style={styles.cardRating}>★ {item.rating}/5</Text>
                            </>
                        )}
                    </View>
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

            {/* SORTING */}
            <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Sort by:</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {[
                        { label: 'Title (A–Z)', value: 'title_asc' },
                        { label: 'Date Added', value: 'date_added' },
                        { label: 'Highest Rated', value: 'rating_desc' }
                    ].map(option => (
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

            {/* FORMAT FILTER */}
            {/* MARIE: only show physical format filters when a specific media type is selected */}
            {activeFilter !== 'All' && (
                <View style={styles.filterSection}>
                    <Text style={styles.sectionLabel}>Format:</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {formatOptions.map(format => (
                            <TouchableOpacity
                                key={format}
                                style={[
                                    styles.filterChip,
                                    formatFilter === format && styles.activeFilterChip
                                ]}
                                onPress={() => setFormatFilter(format)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    formatFilter === format && styles.activeFilterText
                                ]}>
                                    {format}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

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
        borderRadius: theme.radius?.md || 8,
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
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.text,
        marginHorizontal: 16,
        marginBottom: 8,
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
        gap: 12,
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
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        width: 60,
        height: 90,
        borderRadius: 6,
        marginRight: 12,
    },
    cardImagePlaceholder: {
        width: 60,
        height: 90,
        borderRadius: 6,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    placeholderText: {
        fontSize: 11,
        color: theme.colors.secondaryText,
        textAlign: 'center',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius?.md || 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 16,
        marginBottom: 10,
    },
    cardContent: {
        flex: 1,
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
    },
    cardRating: {
        fontSize: 12,
        fontWeight: '600',
        color: '#D99A00',
    },
});