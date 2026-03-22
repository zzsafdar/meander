import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { lightTheme } from '../../theme/theme';

type StateViewProps = {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children?: React.ReactNode;
};

export function StateView({
  isLoading,
  error,
  isEmpty,
  emptyMessage,
  children,
}: StateViewProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error</Text>
        <Text style={styles.message}>{error}</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>{emptyMessage || 'No data available'}</Text>
      </View>
    );
  }

  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loading: {
    fontSize: 18,
    color: lightTheme.colors.primary,
  },
  error: {
    fontSize: 18,
    color: '#d32f2f',
  },
  empty: {
    fontSize: 18,
    color: '#5f6368',
  },
  message: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 8,
    textAlign: 'center',
  },
});
