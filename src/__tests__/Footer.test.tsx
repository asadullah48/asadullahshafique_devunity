// Footer Component Tests
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('should render the footer', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Asadullah Shafique/i)).toBeInTheDocument();
  });

  it('should render current year', () => {
    render(<Footer />);
    
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(year)).toBeInTheDocument();
  });

  it('should render GitHub link', () => {
    render(<Footer />);
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github'));
  });
});
