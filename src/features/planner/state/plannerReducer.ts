import type { PlannerState, PlannerAction } from '../types';
import { initialPlannerState } from '../types';

export function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'loading', error: null };
    case 'SUCCESS':
      return { status: 'success', itinerary: action.itinerary, error: null };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return initialPlannerState;
    default:
      return state;
  }
}
