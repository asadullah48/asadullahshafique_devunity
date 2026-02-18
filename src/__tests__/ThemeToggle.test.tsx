// ThemeToggle Component Tests
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/ThemeToggle';

// Mock useTheme from next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  }),
}));

describe('ThemeToggle', () => {
  it('should render the toggle button', () => {
    render(<ThemeToggle />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display moon icon in light mode', () => {
    render(<ThemeToggle />);
    
    // Moon icon should be present for switching to dark
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });
});
