// File: app/components/CustomButton.js
// Purpose: Reusable touch target component that inherits global theme properties.
// Author: Sabelli Antebi Delmas
// External Sources: Gemini (Code Template)

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// TODO (Sabelli): Import Lauren's global theme settings (colors, typography) to use in your stylesheet.

// TODO (Sabelli): Build a functional component that accepts 'title' and 'onPress' as props.
// 'title' will be the text displayed on the button (e.g., "View Collection").
// 'onPress' will be the navigation routing function passed from the parent screen.
export default function CustomButton({ /* TODO: Destructure props here */ }) {
    return (
        // TODO (Sabelli): Replace this null return with a TouchableOpacity.
        // 1. Attach the 'button' style object to the TouchableOpacity.
        // 2. Assign the 'onPress' prop to the TouchableOpacity's onPress event.
        // 3. Inside the TouchableOpacity, render a Text component.
        // 4. Render the 'title' prop inside the Text component.
        // 5. Attach the 'text' style object to the Text component.
        null
    );
}

// TODO (Sabelli): Define the localized styles for this component by pulling from Lauren's global theme.
const styles = StyleSheet.create({
    button: {
        // TODO: Set backgroundColor using 'colors.light.primaryButton' from Lauren's theme file.
        // TODO: Add padding, borderRadius, width, and marginVertical to shape the touch target.
    },
    text: {
        // TODO: Spread or reference the properties from Lauren's 'typography.buttonText' object.
        // TODO: Ensure the text color provides high contrast against the primary button background.
    }
});