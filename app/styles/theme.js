// File: app/styles/theme.js
// Purpose: File that defines the light, dark, and custom themes.
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

// 1. Garden Theme: Soft greens and earthy colors
export const gardenTheme = {
  colors: {
    background: "#F3F7F0",
    surface: "#FFFFFF",
    primary: "#557B55",
    primaryLight: "#E2EEDF",
    text: "#263629",
    secondaryText: "#718071",
    border: "#DCE6D8",
    iconBackground: "#EAF1E6",
    danger: "#C65B55",
    statusBar: "#F3F7F0",
  },

  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: lightTheme.typography,
};

// 2. Tropical Theme: Ocean blues and warm coral colors
export const tropicalTheme = {
  colors: {
    background: "#FFF7EF",
    surface: "#FFFFFF",
    primary: "#0797A5",
    primaryLight: "#DDF5F3",
    text: "#263746",
    secondaryText: "#71838C",
    border: "#DDEBEA",
    iconBackground: "#E5F6F3",
    danger: "#E76F61",
    statusBar: "#FFF7EF",
  },

  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: lightTheme.typography,
};

// 3. Industrial Theme: Dark slate and cool blue colors
export const industrialTheme = {
  colors: {
    background: "#20262E",
    surface: "#2B333D",
    primary: "#8AA9C7",
    primaryLight: "#394A5B",
    text: "#F0F3F6",
    secondaryText: "#B0BAC5",
    border: "#414D59",
    iconBackground: "#37424E",
    danger: "#F07878",
    statusBar: "#20262E",
  },

  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: lightTheme.typography,
};

// Returns the appropriate theme based on a theme name string (or legacy boolean).
export const getTheme = (themeName = "light") => {
  // Maintain backwards compatibility with screens passing isDarkMode (boolean)
  if (typeof themeName === "boolean") {
    return themeName ? darkTheme : lightTheme;
  }

  switch (themeName) {
    case "dark":
      return darkTheme;

    case "garden":
      return gardenTheme;

    case "tropical":
      return tropicalTheme;

    case "industrial":
      return industrialTheme;

    default:
      return lightTheme;
  }
};