import type { ExpoConfig } from 'expo/config';
const config: ExpoConfig = {
  name: "meander",
  slug: "meander",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  plugins: [
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsVersion: "11.1.0",
        RNMapboxMapsDownloadToken: process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN
      }
    ]
  ],
  extra: {
    // Expose for client usage if needed elsewhere
    EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
  }
};

export default config;
