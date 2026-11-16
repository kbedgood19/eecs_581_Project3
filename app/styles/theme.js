// File: app/styles/theme.js
// Purpose: File that defines the light and dark mode themes.
// Author: Lauren Lee
// External Sources: Gemini (Code Template)

export const lightTheme = {
  colors: {
    background: "#F7F8FC",
    surface: "#FFFFFF",
    primary: "#6276D9",
    primaryLight: "#E9EDFF",

    text: "#252A38",
    secondaryText: "#7B8293",

    border: "#E5E8F0",
    iconBackground: "#EEF0FA",

    danger: "#E05252",
    statusBar: "#F7F8FC",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    full: 999,
  },

  typography: {
    title: 28,
    heading: 20,
    body: 16,
    caption: 13,
  },
};

export const darkTheme = {
  colors: {
    background: "#151821",
    surface: "#222735",
    primary: "#899AFF",
    primaryLight: "#303958",

    text: "#F3F4F8",
    secondaryText: "#A1A9B9",

    border: "#373E4E",
    iconBackground: "#30374A",

    danger: "#FF7777",
    statusBar: "#151821",
  },

  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: lightTheme.typography,
};

// SPRINT 2 TODO (Lauren): Create 3 new custom themes below to give users more variety!
// Suggested concepts (feel free to do whatever you want!): 
// 1. 'gardenTheme' (greens, earthy, floral)
// 2. 'tropicalTheme' (vibrant, beachy, warm)
// 3. 'industrialTheme' or 'slateTheme' (neutral, darker greys, more masculine)
//
// Build each one using the exact same structure as darkTheme.
// You only need to define custom hex codes for the 'colors' object. 
// You can reuse the standard spacing, radius, and typography at the bottom of each!




// SPRINT 2 TODO (Lauren): Refactor the getTheme function to handle more than 2 themes.
// 1. Change the parameter from a boolean (isDarkMode = false) to a string (themeName = 'light').
// 2. Remove the current ternary operator (isDarkMode ? darkTheme : lightTheme).
// 3. Write a switch statement (or a series of if/else if statements) that checks 'themeName'.
//    - if 'dark', return darkTheme
//    - if 'garden', return gardenTheme
//    - if 'tropical', return tropicalTheme
//    - if 'industrial', return industrialTheme
// 4. ALWAYS include a 'default' case that returns lightTheme as the safe fallback.
// Returns the appropriate theme based on dark mode state.
export const getTheme = (isDarkMode = false) => {
  return isDarkMode ? darkTheme : lightTheme;
};
