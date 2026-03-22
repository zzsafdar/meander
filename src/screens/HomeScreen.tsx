import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PlannerSearchBar } from '../search/components/PlannerSearchBar';
import { usePlanTrip } from '../planner/hooks/usePlanTrip';
import { theme } from '../../theme/theme';
import { StateView } from '../../components/StateView';
import { ErrorNotice } from '../../components/ErrorNotice';

export function HomeScreen() {
  const [prompt, setPrompt] = useState('');
  const { itinerary, isLoading, error, planTrip } = usePlanTrip();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      return;
    }
    await planTrip(prompt);
  };

  const handleRetry = () => {
    handleSubmit();
  };

  return (
    <View style={styles.container}>
      <PlannerSearchBar
        value={prompt}
        onChangeValue={setPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
      {isLoading && (
        <View style={styles.loading}>
          <StateView isLoading />
        </View>
      )}
      {error && (
        <View style={styles.error}>
          <ErrorNotice error={error} onRetry={handleRetry} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    padding: 16,
  },
});
