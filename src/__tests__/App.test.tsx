import React from 'react';
import { render } from '../test-utils/render';
import App from '../../App';

describe('App', () => {
  it('renders the Meander title', () => {
    const { getByText } = render(<App />);
    expect(getByText('Meander')).toBeTruthy();
  });
});
