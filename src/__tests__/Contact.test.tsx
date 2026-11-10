// Contact Form Component Tests
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '@/components/Contact';

// Synthetic fixtures only; fetch is mocked.
// Mock fetch
global.fetch = jest.fn();

describe('Contact Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render contact form', () => {
    render(<Contact />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enquiry type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<Contact />);
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInvalid();
    });
  });

  it('should validate email format', async () => {
    render(<Contact />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(emailInput).toBeInvalid();
    });
  });

  it('should submit form successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ leadId: 'synthetic-123' }),
    });

    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Synthetic Visitor' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'synthetic@example.invalid' },
    });
    fireEvent.change(screen.getByLabelText(/enquiry type/i), {
      target: { value: 'job' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Synthetic test message' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/contact'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('should show error on failed submission', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Synthetic Visitor' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'synthetic@example.invalid' },
    });
    fireEvent.change(screen.getByLabelText(/enquiry type/i), {
      target: { value: 'job' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Synthetic test message' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
