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

// Returns the appropriate theme based on dark mode state.
export const getTheme = (isDarkMode = false) => {
  return isDarkMode ? darkTheme : lightTheme;
};
