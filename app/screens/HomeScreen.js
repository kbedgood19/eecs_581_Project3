// File: app/screens/HomeScreen.js
// Purpose: Foundational home screen that displays the app title and functional navigation buttons.
// Author: Lauren Lee

// Import React and useState for managing the search input.
import React, { useState } from "react";

// Import React and useState for managing the search input.
import React, { useState } from "react";

// Import React Native components.
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  StatusBar,
  ScrollView,
  TextInput,
} from "react-native";

// Import Lucide icons.
import {
  Library,
  PlusCircle,
  Heart,
  Clock,
  Search,
} from "lucide-react-native";

// Import the shared theme configuration (light and dark mode).
import { getTheme } from "../styles/theme";

export default function HomeScreen({
  // Data passed from the parent component or database.
  totalItems = 0,
  recentItems = [],
  favoriteItems = [],

  // Dark mode state and callback.
  isDarkMode = false,
  onToggleTheme = () => {},

  // Navigation callbacks for moving to other screens.
  onNavigateCollection = () => {},
  onNavigateAdd = () => {},
  onNavigateFavorites = () => {},
  onNavigateRecent = () => {},

  // Callback used to send the search query to the Collection Screen.
  onSearch = () => {},
}) {
  // Select the appropriate theme based on the current dark mode setting.
  const theme = getTheme(isDarkMode);

  // Generate styles using the selected theme colors.
  const styles = createStyles(theme);

  // Store the text entered into the search bar.
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search submission.
  // Remove unnecessary spaces and only search when the input is not empty.
  const handleSearch = () => {
    const query = searchQuery.trim();

    if (query.length > 0) {
      onSearch(query);
    }
  };

  // Reusable component for displaying a quick action card.
  // This avoids repeating the same layout for Collection, Add, and Favorites.
  const ActionCard = ({
    title,
    description,
    icon,
    onPress,
  }) => (
    <TouchableOpacity
      style={styles.actionCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Icon displayed inside a rounded background. */}
      <View style={styles.actionIcon}>
        {icon}
      </View>

      {/* Title and description of the action. */}
      <View style={styles.actionInfo}>
        <Text style={styles.actionTitle}>{title}</Text>

        <Text style={styles.actionDescription}>
          {description}
        </Text>
      </View>

      {/* Arrow indicates that the card can be opened. */}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Adjust the status bar text color for light and dark mode. */}
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.statusBar}
      />

      {/* ScrollView allows the dashboard to fit smaller screens. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ================= HEADER ================= */}
        {/* Displays the application name and dark mode switch. */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>
              Media Catalog
            </Text>

            <Text style={styles.subtitle}>
              Your personal media library
            </Text>
          </View>

          {/* Allows the user to switch between light and dark mode. */}
          <View style={styles.themeToggle}>
            <Text style={styles.themeIcon}>
              {isDarkMode ? "☾" : "☀"}
            </Text>

            <Switch
              value={isDarkMode}
              onValueChange={onToggleTheme}
              trackColor={{
                false: "#C9CED8",
                true: theme.colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ================= WELCOME SECTION ================= */}
        {/* Introduces the app and its main purpose. */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Your Media,{"\n"}Your Story.
          </Text>

          <Text style={styles.welcomeDescription}>
            Keep track of everything you love,
            all in one place.
          </Text>
        </View>

        {/* ================= COLLECTION SUMMARY ================= */}
        {/* Shows the total number of media items in the collection. */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Library
              size={27}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryNumber}>
              {totalItems}
            </Text>

            <Text style={styles.summaryLabel}>
              Total Media Items
            </Text>
          </View>
        </View>

        {/* ================= SEARCH BAR ================= */}
        {/* Lets users enter a title and send the query to the Collection Screen. */}
        <Text style={styles.sectionTitle}>
          Find Your Media
        </Text>

        <View style={styles.searchContainer}>
          <Search
            size={21}
            color={theme.colors.secondaryText}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by media title..."
            placeholderTextColor={theme.colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          <TouchableOpacity
            onPress={handleSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.searchButton}>
              Search
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= QUICK ACTIONS ================= */}
        {/* Provides shortcuts to the main app features. */}
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        {/* Navigate to the user's full media collection. */}
        <ActionCard
          title="My Collection"
          description="Browse your saved media"
          icon={
            <Library
              size={25}
              color={theme.colors.primary}
            />
          }
          onPress={onNavigateCollection}
        />

        {/* Navigate to the Add Media Screen. */}
        <ActionCard
          title="Add New Media"
          description="Add something to your collection"
          icon={
            <PlusCircle
              size={25}
              color={theme.colors.primary}
            />
          }
          onPress={onNavigateAdd}
        />

        {/* Navigate to the user's favorite media. */}
        <ActionCard
          title="Favorites"
          description={`${favoriteItems.length} favorite items`}
          icon={
            <Heart
              size={25}
              color="#D66B82"
            />
          }
          onPress={onNavigateFavorites}
        />

        {/* ================= RECENTLY ADDED ================= */}
        {/* Displays up to three recently added media items. */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>
            Recently Added
          </Text>

          {/* Show View All only when there are recent items. */}
          {recentItems.length > 0 && (
            <TouchableOpacity
              onPress={onNavigateRecent}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAll}>
                View All ›
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Display recent media if available; otherwise show an empty state. */}
        {recentItems.length > 0 ? (
          recentItems.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recentCard}
              activeOpacity={0.7}
              onPress={() => onNavigateCollection(item.id)}
            >
              {/* Clock icon represents recently added items. */}
              <View style={styles.recentIcon}>
                <Clock
                  size={22}
                  color={theme.colors.primary}
                />
              </View>

              {/* Display the media title, type, and format. */}
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>
                  {item.title}
                </Text>

                <Text style={styles.actionDescription}>
                  {item.mediaType || item.type || "Media"}
                  {" · "}
                  {item.format || "Format not specified"}
                </Text>
              </View>

              {/* Selecting an item opens it through the collection navigation callback. */}
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        ) : (
          // Empty state shown when the user has not added any media yet.
          <View style={styles.emptyRecent}>
            <Text style={styles.emptyText}>
              No media added yet.
            </Text>

            <Text style={styles.emptySubtext}>
              Your recently added items will appear here.
            </Text>
          </View>
        )}

        {/* ================= FOOTER ================= */}
        <Text style={styles.footer}>
          Organize. Collect. Enjoy.
        </Text>

      </ScrollView>
    </View>
  );
}

/* ================= HOME SCREEN STYLES ================= */

// createStyles() receives the current theme so the screen
// automatically updates its colors when dark mode changes.
const createStyles = (theme) =>
  StyleSheet.create({

    // Main screen background.
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    // ScrollView content spacing.
    scrollContent: {
      padding: theme.spacing.lg,
      paddingTop: 35,
      paddingBottom: 40,
    },

    // Header layout.
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 40,
    },

    appName: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    subtitle: {
      fontSize: 13,
      color: theme.colors.secondaryText,
      marginTop: 5,
    },

    // Dark mode switch layout.
    themeToggle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    themeIcon: {
      fontSize: 20,
      color: theme.colors.text,
    },

    // Welcome message spacing.
    welcomeSection: {
      marginBottom: 30,
    },

    welcomeTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      lineHeight: 40,
    },

    welcomeDescription: {
      fontSize: 15,
      color: theme.colors.secondaryText,
      marginTop: 12,
      lineHeight: 23,
    },

    // Total collection summary card.
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 30,
    },

    // Background behind the summary icon.
    summaryIcon: {
      width: 55,
      height: 55,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },

    // Summary number and label.
    summaryInfo: {
      marginLeft: 18,
    },

    summaryNumber: {
      fontSize: 27,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    summaryLabel: {
      fontSize: 14,
      color: theme.colors.secondaryText,
      marginTop: 3,
    },

    // Shared section heading style.
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 15,
    },

    // ================= SEARCH STYLES =================

    // Search input container.
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      marginBottom: 30,
    },

    // Search text input.
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 14,
      paddingVertical: 14,
      paddingLeft: 8,
    },

    // Search button text.
    searchButton: {
      color: theme.colors.primary,
      fontWeight: "bold",
      fontSize: 13,
      paddingLeft: 8,
    },

    // ================= QUICK ACTION STYLES =================

    // Reusable quick action card.
    actionCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: 18,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    // Rounded background behind each action icon.
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },

    // Holds the action title and description.
    actionInfo: {
      flex: 1,
      marginLeft: 15,
    },

    actionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },

    actionDescription: {
      fontSize: 13,
      color: theme.colors.secondaryText,
      marginTop: 5,
    },

    // Right-facing arrow on action cards.
    arrow: {
      fontSize: 28,
      color: theme.colors.secondaryText,
    },

    // ================= RECENTLY ADDED STYLES =================

    // Header row containing Recently Added and View All.
    recentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
    },

    viewAll: {
      color: theme.colors.primary,
      fontWeight: "600",
      fontSize: 13,
      marginBottom: 15,
    },

    // Individual recently added media card.
    recentCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    // Rounded background behind the recent item clock icon.
    recentIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },

    // Empty state card when there are no recent items.
    emptyRecent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    emptyText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },

    emptySubtext: {
      fontSize: 12,
      color: theme.colors.secondaryText,
      marginTop: 6,
      textAlign: "center",
    },

    // Bottom message.
    footer: {
      textAlign: "center",
      color: theme.colors.secondaryText,
      fontSize: 13,
      marginTop: 35,
    },

  });
