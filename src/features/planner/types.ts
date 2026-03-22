import type { Itinerary } from '../itinerary/domain/types';

export type PlannerStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PlannerState {
  status: PlannerStatus;
  itinerary: Itinerary | null;
  error: string | null;
}

export type PlannerAction =
  | { type: 'START' }
  | { type: 'SUCCESS'; itinerary: Itinerary }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

export const initialPlannerState: PlannerState = {
  status: 'idle',
  itinerary: null,
  error: null,
};
