// File: app/screens/CollectionScreen.js
// Purpose: Main catalog view with search, filtering, and media display.
// Author: Marie Biernacki

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar 
} from 'react-native';
import { Search, ArrowLeft } from 'lucide-react-native';
import { getTheme } from '../styles/theme';

export default function CollectionScreen({ navigation, route }) {
    // FIXME: Determine theme (can be hooked up to global state later)
    const isDarkMode = false; 
    const theme = getTheme(isDarkMode);
    const styles = createStyles(theme);

    // If navigated here via the HomeScreen search bar, load that initial query
    const initialQuery = route.params?.initialQuery || '';
    
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeFilter, setActiveFilter] = useState('All');

    // Filter categories aligned with schema.js tables
    const filters = ['All', 'Movies', 'Music', 'Books', 'Video Games'];

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle={isDarkMode ? "light-content" : "dark-content"} 
                backgroundColor={theme.colors.background} 
            />


            {/* ================= SEARCH BAR ================= */}
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

            {/* ================= FILTERS ================= */}
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

            {/* ================= MEDIA LIST ================= */}
            {/* Placeholder until database retrieval is wired up */}
            <ScrollView contentContainerStyle={styles.listContainer}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No items found.</Text>
                    <Text style={styles.emptySubtext}>
                        Try adjusting your filters or adding new media to your catalog.
                    </Text>

                    {/* FIXME: TEMPORARY BUTTON TO TEST EDIT SCREEN CONNECTION */}
                    <TouchableOpacity 
                        style={{ marginTop: 20, padding: 10, backgroundColor: theme.colors.primary, borderRadius: 8 }}
                        onPress={() => navigation.navigate('EditMedia', { mediaId: 123 })} // Passing a dummy ID for future use
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Test Edit Screen</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

/* ================= STYLES ================= */
const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 12,
        marginHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    searchInput: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 14,
        paddingVertical: 14,
        paddingLeft: 8,
    },

    // Filters
    filterSection: {
        marginBottom: theme.spacing.md,
    },
    filterScroll: {
        paddingHorizontal: theme.spacing.lg,
        gap: 10,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: theme.radius.full,
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

    // List Container
    listContainer: {
        flexGrow: 1,
        padding: theme.spacing.lg,
    },
    
    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
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
});