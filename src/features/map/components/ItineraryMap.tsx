import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { ItineraryStop } from '../../itinerary/domain/types';
import { env } from '../../../lib/env';
import { lightTheme } from '../../../theme/theme';

type ItineraryMapProps = {
  stops: ItineraryStop[];
  selectedStopId?: string;
  onStopSelect?: (stopId: string) => void;
};

const { width, height } = Dimensions.get('window');

export function ItineraryMap({ stops, selectedStopId, onStopSelect }: ItineraryMapProps) {
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [isReady, setIsReady] = useState(false);

  const stopsWithCoords = stops.filter((stop): stop is ItineraryStop & { coordinates: [number, number] } => 
    stop.coordinates !== undefined
  );

  useEffect(() => {
    if (isReady && stopsWithCoords.length > 0) {
      fitToStops();
    }
  }, [isReady, stopsWithCoords.length]);

  useEffect(() => {
    if (selectedStopId) {
      const stop = stops.find(s => s.id === selectedStopId);
      if (stop?.coordinates && cameraRef.current) {
        cameraRef.current.flyTo(stop.coordinates, 1000);
      }
    }
  }, [selectedStopId]);

  const fitToStops = () => {
    if (stopsWithCoords.length === 0 || !cameraRef.current) return;

    if (stopsWithCoords.length === 1) {
      cameraRef.current.setCamera({
        centerCoordinate: stopsWithCoords[0].coordinates,
        zoomLevel: 14,
        animationDuration: 500,
      });
    } else {
      const bounds = calculateBounds(stopsWithCoords);
      if (bounds && cameraRef.current) {
        cameraRef.current.fitBounds(
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat],
          [50, 50, 50, 250],
          500
        );
      }
    }
  };

  const calculateBounds = (stopsList: typeof stopsWithCoords) => {
    if (stopsList.length === 0) return null;

    const lats = stopsList.map(s => s.coordinates[1]);
    const lngs = stopsList.map(s => s.coordinates[0]);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  };

  if (!env.mapboxAccessToken) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Mapbox token not configured</Text>
      </View>
    );
  }

  if (stopsWithCoords.length === 0) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>No stops with coordinates</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        onMapIdle={() => setIsReady(true)}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={stopsWithCoords[0].coordinates}
        />

        {stopsWithCoords.map((stop, index) => (
          <MapboxGL.PointAnnotation
            key={stop.id}
            id={stop.id}
            coordinate={stop.coordinates}
            onSelected={() => onStopSelect?.(stop.id)}
          >
            <View style={[
              styles.marker,
              selectedStopId === stop.id && styles.markerSelected
            ]}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </MapboxGL.PointAnnotation>
        ))}

        {stopsWithCoords.length > 1 && (
          <MapboxGL.ShapeSource
            id="route-source"
            shape={{
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: stopsWithCoords.map(s => s.coordinates),
                },
                properties: {},
              }],
            }}
          >
            <MapboxGL.LineLayer
              id="route-layer"
              style={{
                lineColor: lightTheme.colors.primary,
                lineWidth: 3,
                lineOpacity: 0.6,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
  },
  placeholderText: {
    fontSize: 16,
    color: '#5f6368',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: lightTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerSelected: {
    backgroundColor: '#d32f2f',
    transform: [{ scale: 1.2 }],
  },
  markerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
