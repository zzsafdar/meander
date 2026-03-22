import '@testing-library/jest-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@rnmapbox/maps', () => ({
  MapView: 'MapView',
  Camera: 'Camera',
  PointAnnotation: 'PointAnnotation',
  ShapeSource: 'ShapeSource',
  LineLayer: 'LineLayer',
  SymbolLayer: 'SymbolLayer',
  Images: 'Images',
  MarkerView: 'MarkerView',
  UserLocation: 'UserLocation',
  setAccessToken: jest.fn(),
  locationManager: {
    start: jest.fn(),
    stop: jest.fn(),
  },
}));
// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: 51.5074, longitude: -0.1278 }
  })),
  watchPositionAsync: jest.fn(),
}));

// Mock React Native Paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  
  return {
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Card: ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children),
    Text: ({ children }: { children: React.ReactNode }) => React.createElement(Text, null, children),
    TextInput: (props: any) => React.createElement(TextInput, props),
    Button: ({ children, onPress }: any) => 
      React.createElement(TouchableOpacity, { onPress }, 
        React.createElement(Text, null, children)
      ),
    IconButton: ({ onPress, icon }: any) => 
      React.createElement(TouchableOpacity, { onPress, testID: `icon-button-${icon}` },
        React.createElement(Text, null, icon)
      ),
    ActivityIndicator: () => React.createElement(View, { testID: 'activity-indicator' }),
    useTheme: () => ({ colors: { primary: '#6200ee', background: '#ffffff' } }),
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
