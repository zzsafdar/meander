import { render, fireEvent } from '@testing-library/react-native';
import { PlannerSearchBar } from '../components/PlannerSearchBar';

jest.mock('../../itinerary/services/openaiItineraryService', () => ({
  generateItinerary: jest.fn(),
}));

jest.mock('../../geocoding/services/mapboxGeocodingService', () => ({
  geocodePlace: jest.fn(),
}));

jest.mock('../../routing/services/routingService', () => ({
  getRoute: jest.fn(),
}));

describe('PlannerSearchBar', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <PlannerSearchBar value="" onChangeValue={() => {}} onSubmit={() => {}} />
    );

    expect(getByPlaceholderText('What would you like to see today?')).toBeTruthy();
  });

  it('calls onSubmit when submit button pressed', async () => {
    const mockOnSubmit = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <PlannerSearchBar value="test prompt" onChangeValue={() => {}} onSubmit={mockOnSubmit} />
    );

    const input = getByPlaceholderText('What would you like to see today?');
    fireEvent.changeText(input, 'coffee shops in London');

    const submitButton = getByText('Search');
    fireEvent.press(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('updates value when text changes', () => {
    const mockOnChange = jest.fn();

    const { getByPlaceholderText } = render(
      <PlannerSearchBar value="" onChangeValue={mockOnChange} onSubmit={() => {}} />
    );

    const input = getByPlaceholderText('What would you like to see today?');
    fireEvent.changeText(input, 'new text');

    expect(mockOnChange).toHaveBeenCalledWith('new text');
  });
});
