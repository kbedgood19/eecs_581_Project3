// File: app/screens/FavoritesScreen.js
// Purpose: Displays 5-star favorite media items, shares favorites as a text bundle,
//          and lets users open another user's shared favorites list in read-only mode.
// Author: Jaydine Stiles
// Code Template: Marie Biernacki, Gemini

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
    Image,
    Share,
    Modal,
    Alert
} from 'react-native';

import { Search, Share2, Download, X } from 'lucide-react-native';

// connected directly to ThemeContext so this screen stays compatible with Req 12
import { useTheme } from '../styles/ThemeContext';

import { getFavoriteMedia } from '../database/supabaseController';
import { supabase } from '../database/supabase';

// physical format options mapped by collection media type filter (mirrors CollectionScreen)
const FORMAT_MAP = {
    Movies: ['DVD', 'Blu-ray', '4K UHD', 'VHS'],
    Books: ['Hardcover', 'Paperback'],
    Music: ['Vinyl', 'CD', 'Cassette'],
    'Video Games': ['Disc', 'Cartridge']
};

// markers used to wrap and extract the JSON payload when sharing/importing favorites
const SHARE_START_MARKER = '---FAVORITES_START---';
const SHARE_END_MARKER = '---FAVORITES_END---';

export default function FavoritesScreen({ navigation }) {
    const { theme, isDark } = useTheme();
    const styles = createStyles(theme);

    // filter and sort state (mirrors CollectionScreen)
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortBy, setSortBy] = useState('title_asc');
    const [formatFilter, setFormatFilter] = useState('All');

    // own favorites loaded from Supabase (Req 13.1)
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // shared favorites state (Req 13.3)
    // when sharedList is null -> viewing own favorites
    // when sharedList is { sharedBy, items } -> viewing another user's list (read-only)
    const [sharedList, setSharedList] = useState(null);
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [sharedTextInput, setSharedTextInput] = useState('');

    const isViewingShared = sharedList !== null;

    const filters = ['All', 'Movies', 'Music', 'Books', 'Video Games'];

    const formatOptions = activeFilter !== 'All'
        ? ['All', ...(FORMAT_MAP[activeFilter] || []), 'Unspecified']
        : [];

    // reset format filter when switching media types
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setFormatFilter('All');
    };

    // =========================================================================
    // SPRINT 3 (Jaydine) - REQUIREMENT 13 (13.1: LOAD 5-STAR FAVORITES)
    // PSEUDOCODE:
    // 1. Inside loadFavorites(), only run when NOT viewing a shared list (isViewingShared === false)
    // 2. Call supabase.auth.getUser() to get the logged-in user
    //    - IF userError or no user: set favoriteItems to [] and return
    // 3. Call getFavoriteMedia(user.id, searchQuery, activeFilter, sortBy, formatFilter)
    // 4. IF isActive is true, call setFavoriteItems(data)
    // 5. Wrap in try/catch/finally so setIsLoading(false) always runs when isActive is true
    // =========================================================================
    useFocusEffect(
        useCallback(() => {
            if (isViewingShared) {
                setIsLoading(false);
                return;
            }

            let isActive = true;

            async function loadFavorites() {
                setIsLoading(true);
                try {
                    // TODO: implement steps 2-4 above
                    if (isActive) {
                        setFavoriteItems([]);
                    }
                } catch (error) {
                    console.error('Failed to fetch favorites:', error);
                } finally {
                    if (isActive) {
                        setIsLoading(false);
                    }
                }
            }

            const delaySearch = setTimeout(() => {
                loadFavorites();
            }, 300);

            return () => {
                clearTimeout(delaySearch);
                isActive = false;
            };
        }, [searchQuery, activeFilter, sortBy, formatFilter, isViewingShared])
    );

    // =========================================================================
    // SPRINT 3 (Jaydine) - REQUIREMENT 13 (13.2: SHARE FAVORITES LIST)
    // PSEUDOCODE:
    // 1. Get the current logged-in user via supabase.auth.getUser()
    //    - IF no user, show Alert and return
    // 2. Fetch ALL of the user's 5-star items with getFavoriteMedia(user.id)
    //    (pass no filters so the full Favorites list is shared, not just filtered items)
    // 3. IF the returned list is empty:
    //    - Show Alert: "No Favorites Yet", "Rate an item 5 stars before sharing."
    //    - return early
    // 4. Build a sanitized payload object containing ONLY 5-star favorite data
    //    (do NOT include user_id or non-favorite items):
    //    const payload = {
    //        sharedBy: user.email || 'A Media Catalog User',
    //        items: allFavorites.map(item => ({
    //            id: item.id,
    //            title: item.title,
    //            type_name: item.type_name,
    //            format_name: item.format_name,
    //            genre: item.genre,
    //            releaseYear: item.releaseYear,
    //            rating: item.rating,
    //            // only include hosted image URLs (local file:// paths will not load on another phone)
    //            photo_uri: item.photo_uri?.startsWith('http') ? item.photo_uri : null
    //        }))
    //    };
    // 5. Build the shareable string wrapping JSON.stringify(payload) between
    //    SHARE_START_MARKER and SHARE_END_MARKER:
    //    const message = `Check out my Media Catalog Favorites!\n${SHARE_START_MARKER}\n${JSON.stringify(payload)}\n${SHARE_END_MARKER}`;
    // 6. Call await Share.share({ message }) inside try/catch
    // =========================================================================
    const handleShareFavorites = async () => {
        // TODO: implement steps 1-6 above
        Alert.alert('Coming Soon', 'Share Favorites has not been implemented yet.');
    };

    // =========================================================================
    // SPRINT 3 (Jaydine) - REQUIREMENT 13 (13.3: OPEN SHARED FAVORITES LIST)
    // PSEUDOCODE:
    // 1. Trim sharedTextInput. IF empty, show Alert and return
    // 2. Extract the JSON string:
    //    - Check if text includes SHARE_START_MARKER and SHARE_END_MARKER
    //    - IF yes: slice the substring between the two markers and trim it
    //    - ELSE: use the trimmed text directly (allows pasting raw JSON too)
    // 3. Inside try/catch, run JSON.parse(jsonString)
    // 4. Validate that parsed && Array.isArray(parsed.items)
    //    - Keep only items rated 5 stars (item.rating >= 5) as an extra safety check
    //    - IF invalid format, throw an error or show an Alert
    // 5. Save the parsed list into state:
    //    setSharedList({
    //        sharedBy: parsed.sharedBy || 'Another User',
    //        items: validItems
    //    });
    // 6. Reset filters (searchQuery -> '', activeFilter -> 'All', formatFilter -> 'All')
    // 7. Clear sharedTextInput ('') and close modal (setIsImportModalVisible(false))
    // 8. In catch: show Alert("Invalid Shared List", "Please paste the full shared favorites message.")
    // =========================================================================
    const handleOpenSharedList = () => {
        // TODO: implement steps 1-8 above
        Alert.alert('Coming Soon', 'Open Shared List has not been implemented yet.');
    };

    // return from read-only shared view back to the user's own favorites
    const handleExitSharedList = () => {
        setSharedList(null);
        setSearchQuery('');
        setActiveFilter('All');
        setFormatFilter('All');
        setSortBy('title_asc');
    };

    // =========================================================================
    // SPRINT 3 (Jaydine) - REQUIREMENT 13 (13.3: FILTER/SORT SHARED ITEMS)
    // PSEUDOCODE:
    // 1. IF isViewingShared is false, return favoriteItems directly
    // 2. ELSE start with a shallow copy: let results = [...sharedList.items]
    // 3. Apply the same filter/sort rules as getMediaCatalog():
    //    - searchQuery: match item.title case-insensitively
    //    - activeFilter !== 'All': map 'Movies'->'Movie', 'Books'->'Book',
    //      'Video Games'->'VideoGame' and match item.type_name
    //    - formatFilter !== 'All': match item.format_name case-insensitively
    //    - sortBy: 'title_asc' (localeCompare), 'date_added' (b.id - a.id),
    //      or 'rating_desc' ((b.rating ?? -1) - (a.rating ?? -1))
    // 4. Return results
    // =========================================================================
    const getDisplayedItems = () => {
        if (!isViewingShared) {
            return favoriteItems;
        }
        // TODO: implement steps 2-4 above so search/filters/sorting also work on shared lists
        return sharedList.items || [];
    };

    const displayedItems = getDisplayedItems();

    // UI for a single media item card (mirrors CollectionScreen exactly)
    const renderMediaCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                // SPRINT 3 - REQUIREMENT 13
                // own favorites open EditMedia (just like CollectionScreen)
                // shared favorites stay read-only so the recipient cannot edit another user's item
                if (isViewingShared) {
                    Alert.alert(
                        item.title,
                        [
                            item.type_name ? `Type: ${item.type_name}` : null,
                            item.format_name ? `Format: ${item.format_name}` : null,
                            item.genre ? `Genre: ${item.genre}` : null,
                            item.releaseYear ? `Year: ${item.releaseYear}` : null,
                            item.rating != null ? `Rating: ★ ${item.rating}/5` : null
                        ]
                            .filter(Boolean)
                            .join('\n')
                    );
                } else {
                    navigation.navigate('EditMedia', { mediaId: item.id });
                }
            }}
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

    // Empty state UI extracted for the FlatList (mirrors CollectionScreen)
    const ListEmptyComponent = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
                {isViewingShared ? 'No shared favorites match your filters.' : 'No favorites found.'}
            </Text>
            <Text style={styles.emptySubtext}>
                {isViewingShared
                    ? 'Try clearing your search or filters.'
                    : 'Rate any media item 5 stars to see it appear here automatically.'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.statusBar || theme.colors.background}
            />

            {/* SPRINT 3 - REQUIREMENT 13: SHARE / VIEW SHARED CONTROLS */}
            {isViewingShared ? (
                <View style={styles.sharedBanner}>
                    <View style={styles.sharedBannerInfo}>
                        <Text style={styles.sharedBannerTitle}>
                            Shared Favorites (Read-Only)
                        </Text>
                        <Text style={styles.sharedBannerSubtitle}>
                            Shared by {sharedList.sharedBy}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.exitSharedButton}
                        onPress={handleExitSharedList}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.exitSharedButtonText}>My Favorites</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.actionBar}>
                    <TouchableOpacity
                        style={styles.primaryActionButton}
                        onPress={handleShareFavorites}
                        activeOpacity={0.7}
                    >
                        <Share2 size={16} color="#FFFFFF" />
                        <Text style={styles.primaryActionText}>Share Favorites</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryActionButton}
                        onPress={() => setIsImportModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Download size={16} color={theme.colors.primary} />
                        <Text style={styles.secondaryActionText}>View Shared List</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* SEARCH BAR (mirrors CollectionScreen) */}
            <View style={styles.searchContainer}>
                <Search size={21} color={theme.colors.secondaryText} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search favorites by title..."
                    placeholderTextColor={theme.colors.secondaryText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
            </View>

            {/* FILTERS (mirrors CollectionScreen) */}
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
                            onPress={() => handleFilterChange(filter)}
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

            {/* SORTING (mirrors CollectionScreen) */}
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

            {/* FORMAT FILTER (mirrors CollectionScreen) */}
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

            {/* MEDIA LIST (mirrors CollectionScreen) */}
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={displayedItems}
                    keyExtractor={(item, index) =>
                        item.id != null ? item.id.toString() : `shared-${index}`
                    }
                    renderItem={renderMediaCard}
                    ListEmptyComponent={ListEmptyComponent}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {/* SPRINT 3 - REQUIREMENT 13 (13.3: PASTE SHARED LIST MODAL) */}
            <Modal
                visible={isImportModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsImportModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Open Shared Favorites</Text>
                            <TouchableOpacity
                                onPress={() => setIsImportModalVisible(false)}
                                activeOpacity={0.7}
                            >
                                <X size={20} color={theme.colors.secondaryText} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalDescription}>
                            Paste the Favorites list shared by another user below to view their 5-star items.
                        </Text>

                        <TextInput
                            style={styles.modalTextInput}
                            placeholder="Paste shared favorites text here..."
                            placeholderTextColor={theme.colors.secondaryText}
                            value={sharedTextInput}
                            onChangeText={setSharedTextInput}
                            multiline
                            textAlignVertical="top"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => {
                                    setSharedTextInput('');
                                    setIsImportModalVisible(false);
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={handleOpenSharedList}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.modalConfirmText}>Open List</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* ================= STYLES ================= */
const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    // SPRINT 3 - REQUIREMENT 13: action bar & shared banner styles
    actionBar: {
        flexDirection: 'row',
        gap: 10,
        marginHorizontal: theme.spacing?.lg || 16,
        marginTop: theme.spacing?.lg || 16,
    },
    primaryActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: theme.radius?.md || 8,
    },
    primaryActionText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    secondaryActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: theme.radius?.md || 8,
    },
    secondaryActionText: {
        color: theme.colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    sharedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius?.md || 8,
        padding: 12,
        marginHorizontal: theme.spacing?.lg || 16,
        marginTop: theme.spacing?.lg || 16,
    },
    sharedBannerInfo: {
        flex: 1,
        marginRight: 10,
    },
    sharedBannerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    sharedBannerSubtitle: {
        fontSize: 12,
        color: theme.colors.secondaryText,
        marginTop: 2,
    },
    exitSharedButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: theme.radius?.md || 8,
    },
    exitSharedButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    // CollectionScreen mirrored styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius?.md || 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 12,
        marginHorizontal: theme.spacing?.lg || 16,
        marginTop: theme.spacing?.md || 12,
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
    // SPRINT 3 - REQUIREMENT 13: modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius?.lg || 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    modalDescription: {
        fontSize: 13,
        color: theme.colors.secondaryText,
        marginBottom: 12,
        lineHeight: 18,
    },
    modalTextInput: {
        height: 130,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius?.md || 8,
        padding: 12,
        fontSize: 13,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    modalCancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: theme.radius?.md || 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    modalCancelText: {
        color: theme.colors.secondaryText,
        fontSize: 13,
        fontWeight: '600',
    },
    modalConfirmButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: theme.radius?.md || 8,
    },
    modalConfirmText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
});