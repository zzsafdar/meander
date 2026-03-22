import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ItineraryList } from '../itinerary/components/ItineraryList';
import { ItineraryMap } from '../map/components/ItineraryMap';
import { usePlanTrip } from '../planner/hooks/usePlanTrip';
import { theme } from '../../theme/theme';
import { StateView } from '../../components/StateView';
import { ErrorNotice } from '../../components/ErrorNotice';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Itinerary'>;

export function ItineraryScreen({ route }: Props) {
  const { itinerary, isLoading, error, enrichItineraryWithCoords, computeRoutesForStops } = usePlanTrip();
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>();

  useEffect(() => {
    if (itinerary && itinerary.stops.length > 0) {
      enrichItineraryWithCoords(itinerary).then((enriched) => {
        computeRoutesForStops(enriched.stops);
      });
    }
  }, [itinerary, enrichItineraryWithCoords, computeRoutesForStops]);

  if (!itinerary && !isLoading && !error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No itinerary to display</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <StateView isLoading />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.error}>
          <ErrorNotice error={error} onRetry={() => {}} />
        </View>
      </View>
    );
  }

  if (!itinerary) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No itinerary to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.listContainer}>
          <ItineraryList
            stops={itinerary.stops}
            onStopPress={setSelectedStopId}
            selectedStopId={selectedStopId}
          />
        </View>
        <View style={styles.mapContainer}>
          <ItineraryMap
            stops={itinerary.stops}
            selectedStopId={selectedStopId}
            onStopSelect={setSelectedStopId}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    padding: 16,
  },
  listContainer: {
    height: Dimensions.get('window').height * 0.4,
  },
  mapContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
});
