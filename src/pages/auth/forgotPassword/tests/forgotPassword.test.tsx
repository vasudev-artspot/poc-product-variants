import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from '../ForgotPassword';
import ForgotPasswordService from '../../../../services/auth/ForgotPasswordService';

// Mock ForgotPasswordService
jest.mock('../../../../services/auth/ForgotPasswordService');
const mockVerifyEmail = jest.fn();

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ForgotPasswordService as jest.Mock).mockImplementation(() => ({
      verifyEmail: mockVerifyEmail,
    }));
    localStorage.clear();
  });

  it('renders the Forgot Password form', () => {
    renderWithRouter(<ForgotPassword />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByTestId('topic-email')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('shows validation error when email is not entered', async () => {
    renderWithRouter(<ForgotPassword />);
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email address', async () => {
    renderWithRouter(<ForgotPassword />);

    const input = screen.getByTestId('topic-email').querySelector('input');
    fireEvent.change(input!, {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });


  it('submits valid form and redirects on success', async () => {
    mockVerifyEmail.mockResolvedValue(true);

    renderWithRouter(<ForgotPassword />);
    const input = screen.getByTestId('topic-email').querySelector('input');
    fireEvent.change(input!, {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockVerifyEmail).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(localStorage.getItem('forgotPasswordEmail')).toBe('test@example.com');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/verify-code');
    });
  });


  it('shows error message if user is not found', async () => {
    mockVerifyEmail.mockResolvedValue(false);

    renderWithRouter(<ForgotPassword />);

    const input = screen.getByTestId('topic-email').querySelector('input');
    fireEvent.change(input!, {
      target: { value: 'nonexistent@example.com' },
    });

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('User account does not exist')).toBeInTheDocument();
    });
  });


  it('shows error message if server fails', async () => {
    mockVerifyEmail.mockRejectedValue(new Error('Server error'));

    renderWithRouter(<ForgotPassword />);

    const input = screen.getByTestId('topic-email').querySelector('input');
    fireEvent.change(input!, {
      target: { value: 'fail@example.com' },
    });

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(
        screen.getByText('Forgot password request failed, User account does not exist')
      ).toBeInTheDocument();
    });
  });

});
