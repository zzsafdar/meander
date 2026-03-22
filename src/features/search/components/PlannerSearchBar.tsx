import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { lightTheme } from '../../../theme/theme';

type PlannerSearchBarProps = {
  onSubmit: (prompt: string) => void;
  value: string;
  onChangeValue: (value: string) => void;
  isLoading?: boolean;
  error?: string | null;
};

export function PlannerSearchBar({
  onSubmit,
  value,
  onChangeValue,
  isLoading = false,
  error,
}: PlannerSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const isValid = localValue.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid || isLoading) {
      return;
    }
    onChangeValue(localValue.trim());
    onSubmit(localValue.trim());
  };

  const handleChangeText = (text: string) => {
    setLocalValue(text);
    onChangeValue(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="What would you like to see today?"
          placeholderTextColor="#9aa0a6"
          value={localValue}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
          testID="search-input"
          returnKeyType="search"
        />
      </View>

      <View style={styles.actions}>
        {isLoading ? (
          <ActivityIndicator size="small" color={lightTheme.colors.primary} />
        ) : (
          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || isLoading}
            testID="search-submit"
          >
            <Text style={styles.buttonText}>Plan My Day</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Text style={styles.hint}>
        Try: "Coffee shops in Shoreditch" or "Museums in London"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputFocused: {
    borderColor: lightTheme.colors.primary,
    borderWidth: 2,
  },
  actions: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: lightTheme.colors.primary,
    borderRadius: 24,
    alignItems: 'center',
    minWidth: 160,
  },
  buttonDisabled: {
    backgroundColor: '#dadce0',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    fontSize: 14,
    color: '#d32f2f',
    marginTop: 12,
    textAlign: 'center',
  },
  hint: {
    marginTop: 16,
    fontSize: 13,
    color: '#5f6368',
    textAlign: 'center',
  },
});
