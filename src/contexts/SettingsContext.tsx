import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';

interface SettingsContextType {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    const savedFontSize = localStorage.getItem('app-font-size') as FontSize;

    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    if (savedFontSize && ['small', 'medium', 'large'].includes(savedFontSize)) {
      setFontSizeState(savedFontSize);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  const setFontSize = (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    localStorage.setItem('app-font-size', newFontSize);
  };

  return (
    <SettingsContext.Provider value={{ theme, fontSize, setTheme, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
};