import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';
import { ItineraryStop } from '../domain/types';

type StopCardProps = {
  stop: ItineraryStop;
  onPress?: () => void;
  isSelected?: boolean;
};

export function StopCard({ stop, onPress, isSelected }: StopCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.time}>{stop.suggestedTime}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {stop.name}
        </Text>
        {stop.description && (
          <Text style={styles.description} numberOfLines={2}>
            {stop.description}
          </Text>
        )}
      </View>
      <View style={styles.footer}>
        {stop.transportFromPrevious && (
          <Text style={styles.transport}>
            {stop.transportFromPrevious === 'walking' ? '🚶' : '🚌'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  transport: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.primary,
  },
});
