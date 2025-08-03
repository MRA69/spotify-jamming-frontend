import { render, screen } from '@testing-library/react';
import App from './App';

test('renders jamming text', () => {
  render(<App />);
  const linkElement = screen.getByText(/jamming/i);
  expect(linkElement).toBeInTheDocument();
});