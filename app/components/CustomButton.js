// File: app/components/CustomButton.js
// Purpose: Reusable touch target component that inherits global theme properties.
// Author: Sabelli Antebi Delmas, Marie Biernacki
// External Sources: Gemini (Code Template)

// Import React Native components.
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Marie: connect button to global theme context for requirement 12
import { useTheme } from "../styles/ThemeContext";

// Reusable button used across the app.
// 'title' is the text shown on the button.
// 'onPress' is the function that runs when the button is tapped (for example, navigation).
// 'themeOverride' optionally overrides the global theme (used for live previews on AccountScreen)
export default function CustomButton({
    title,
    onPress = () => {},
    themeOverride = null,
}) {

    // SPRINT 3 (Marie): use preview theme if provided, otherwise fall back to global theme
    const { theme } = useTheme();
    const activeTheme = themeOverride || theme;

    // Generate styles using the active theme colors.
    const styles = createStyles(activeTheme);

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

//custom button styles
//createStyles() receives the current theme so the button
//automatically updates its colors when dark mode changes.
const createStyles = (theme) =>
    StyleSheet.create({

    //shape and color of the touch target.
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.radius.lg,
        width: "100%",
        marginVertical: theme.spacing.sm,
        alignItems: "center",
        justifyContent: "center",
    },

    //button text.
    //'surface' is white in light mode and dark in dark mode,
    //so the text always has high contrast against the primary color.
    text: {
        fontSize: theme.typography.body,
        fontWeight: "600",
        color: theme.colors.surface,
    },

    });