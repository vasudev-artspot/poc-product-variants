import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import VerifyCode from '../VerifyCode';
import ForgotPasswordService from '../../../../services/auth/ForgotPasswordService';

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock ForgotPasswordService
jest.mock('../../../../services/auth/ForgotPasswordService');
const mockVerifyOtp = jest.fn();
const mockVerifyEmail = jest.fn();
(ForgotPasswordService as jest.Mock).mockImplementation(() => ({
  verifyOtp: mockVerifyOtp,
  verifyEmail: mockVerifyEmail,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('VerifyCode Component', () => {
  beforeEach(() => {
    localStorage.setItem('forgotPasswordEmail', 'test@example.com');
    jest.clearAllMocks();
  });

  it('renders the Verify Code form', () => {
    renderWithRouter(<VerifyCode />);
    expect(screen.getByText('Verification Code')).toBeInTheDocument();
    expect(screen.getByTestId('verification-code')).toBeInTheDocument();
    expect(screen.getByText('Verify')).toBeInTheDocument();
  });

  it('shows validation error when code is not entered', async () => {
    renderWithRouter(<VerifyCode />);
    fireEvent.click(screen.getByText('Verify'));

    await waitFor(() => {
      expect(screen.getByText('Verification code is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid verification code', async () => {
    renderWithRouter(<VerifyCode />);
    const input = screen.getByTestId('verification-code') as HTMLInputElement;
    fireEvent.change(input!, {
      target: { value: '12345' }, // Invalid (5 digits)
    });
    fireEvent.click(screen.getByText('Verify'));

    await waitFor(() => {
      expect(screen.getByText('Invalid verification code')).toBeInTheDocument();
    });
  });

  it('shows Resend Code link after timer expires', async () => {
    jest.useFakeTimers();
    renderWithRouter(<VerifyCode />);
    jest.advanceTimersByTime(121000); // 121 seconds = just over 2 minutes
    await waitFor(() => {
      expect(screen.getByText('Resend Code')).toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
