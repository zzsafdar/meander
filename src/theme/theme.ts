import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1a73e8',
    primaryContainer: '#d3e3fd',
    secondary: '#5f6368',
    surface: '#ffffff',
    background: '#f8f9fa',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8ab4f8',
    primaryContainer: '#1a73e8',
    secondary: '#9aa0a6',
    surface: '#1f1f1f',
    background: '#121212',
  },
};
