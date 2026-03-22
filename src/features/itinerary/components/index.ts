import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ItineraryStop } from '../../itinerary/domain/types';
import { StopCard } from './StopCard';

type ItineraryListProps = {
  itinerary: Itinerary;
  onStopSelect?: (stopId: string) => void;
}

export function ItineraryList({ itinerary, onStopSelect }: ItineraryListProps) {
  return (
    <FlatList
      data={itinerary.stops}
      keyExtractor={(stop) => stop.id}
      renderItem={({ item, index }) => (
        <StopCard
          stop={item}
          index={index}
          isSelected={false}
          onPress={() => onStopSelect?.(item.id)}
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
});
