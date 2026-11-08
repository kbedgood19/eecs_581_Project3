// File: app/components/CustomButton.js
// Purpose: Reusable touch target component that inherits global theme properties.
// Author: Sabelli Antebi Delmas
// External Sources: Gemini (Code Template)

// Import React Native components.
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Import the shared theme configuration (light and dark mode).
import { getTheme } from "../styles/theme";

// Reusable button used across the app.
// 'title' is the text shown on the button.
// 'onPress' is the function that runs when the button is tapped (for example, navigation).
// 'isDarkMode' selects the light or dark theme, same as the other screens.
export default function CustomButton({
    title,
    onPress = () => {},
    isDarkMode = false,
}) {
  // Select the appropriate theme based on the current dark mode setting.
    const theme = getTheme(isDarkMode);

  // Generate styles using the selected theme colors.
    const styles = createStyles(theme);

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