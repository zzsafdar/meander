import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { env } from '../../../lib/env';

type LocationState = {
  coordinates: { latitude: number; longitude: number } | null;
  errorMsg: string | null;
}

type LocationAction =
  | { type: 'SET_COORDINATES'; payload: LocationState['coordinates'] }
  | { type: 'SET_ERROR'; payload: LocationState['errorMsg'] }
  | { type: 'CLEAR'; };

const initialState: LocationState = {
  coordinates: null,
  errorMsg: null,
};

export function useForegroundLocation() {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null;

    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        dispatch({ type: 'CLEAR' });
        return;
      }

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High },
      },
        subscription.remove();
      dispatch({
        type: 'SET_COORDINATES',
        payload: {
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
        },
      });
    } } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: { errorMsg: error.message },
      });
    };

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return state;
}

function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'SET_COORDINATES':
      return { ...state, coordinates: action.payload };
    case 'SET_ERROR':
      return { ...state, errorMsg: action.payload };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}
