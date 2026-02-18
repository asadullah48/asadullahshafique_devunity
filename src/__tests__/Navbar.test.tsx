// Navbar Component Tests
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';

// Mock the components used in Navbar
jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

jest.mock('@/components/SearchDialog', () => ({
  SearchDialog: () => <div data-testid="search-dialog">Search Dialog</div>,
}));

describe('Navbar', () => {
  it('should render the navbar', () => {
    render(<Navbar />);
    
    expect(screen.getByText('AS')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
  });

  it('should render theme toggle', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('should render search dialog', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();
  });
});
