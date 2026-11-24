// File: app/styles/ThemeContext.js
// Purpose: Global theme state provider with local AsyncStorage persistence.

// Author: Marie Biernacki

// Code Template: Gemini

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from './theme';

const THEME_STORAGE_KEY = 'app_selected_theme';
const DARK_THEME_NAMES = ['dark', 'industrial'];

const ThemeContext = createContext({
    themeName: 'light',
    theme: getTheme('light'),
    isDark: false,
    setThemeName: async () => {},
});

export function ThemeProvider({ children }) {
    const [themeName, setThemeNameState] = useState('light');

    // load saved theme from AsyncStorage when app starts
    useEffect(() => {
        async function loadSavedTheme() {
            try {
                const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (saved) {
                    setThemeNameState(saved);
                }
            } catch (error) {
                console.error('failed to load theme', error);
            }
        }
        loadSavedTheme();
    }, []);

    // create function to update state and save to AsyncStorage
    const setThemeName = async (newThemeName) => {
        setThemeNameState(newThemeName);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeName);
        } catch (error) {
            console.error('failed to save theme', error);
        }
    };

    const theme = getTheme(themeName);
    const isDark = DARK_THEME_NAMES.includes(themeName);

    return (
        <ThemeContext.Provider
            value={{
                themeName,
                theme,
                isDark,
                setThemeName,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

// helper hook so screens only need: const { theme, isDark, themeName, setThemeName } = useTheme();
export function useTheme() {
    return useContext(ThemeContext);
}