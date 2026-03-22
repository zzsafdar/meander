import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { ItineraryStop } from '../domain/types';
import { StopCard } from './StopCard';
import { theme } from '../../../theme/theme';

type ItineraryListProps = {
  stops: ItineraryStop[];
  onStopPress?: (stopId: string) => void;
  selectedStopId?: string;
};

export function ItineraryList({ stops, onStopPress, selectedStopId }: ItineraryListProps) {
  if (stops.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No stops in this itinerary</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={stops}
      keyExtractor={(stop) => stop.id}
      renderItem={({ item }) => (
        <StopCard
          stop={item}
          onPress={() => onStopPress?.(item.id)}
          isSelected={selectedStopId === item.id}
        />
      )}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
});
