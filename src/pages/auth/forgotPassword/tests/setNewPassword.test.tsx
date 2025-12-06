import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SetNewPassword from '../SetNewPassword';
import ForgotPasswordService from '../../../../services/auth/ForgotPasswordService';

// ✅ Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// ✅ Mock ForgotPasswordService
jest.mock('../../../../services/auth/ForgotPasswordService');
const mockSetNewPassword = jest.fn();
(ForgotPasswordService as jest.Mock).mockImplementation(() => ({
  setNewPassword: mockSetNewPassword,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SetNewPassword', () => {
  beforeEach(() => {
    localStorage.setItem('forgotPasswordEmail', 'test@example.com');
    jest.clearAllMocks();
  });

  it('renders the Set New Password form', () => {
    renderWithRouter(<SetNewPassword />);
    expect(screen.getByText('Set a New Password')).toBeInTheDocument();
    expect(screen.getByTestId('new-password')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('shows validation error when new password is not entered', async () => {
    renderWithRouter(<SetNewPassword />);
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(screen.getByText('New password is required')).toBeInTheDocument();
    });
  });

  it('shows validation error when passwords do not match', async () => {
    renderWithRouter(<SetNewPassword />);
    await act(async () => {
      fireEvent.input(screen.getByTestId('new-password'), {
        target: { value: 'password123' },
      });
      fireEvent.input(screen.getByTestId('confirm-password'), {
        target: { value: 'password124' },
      });
    });

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  // it('submits form and navigates on success', async () => {
  //   mockSetNewPassword.mockResolvedValue(true);
  //   renderWithRouter(<SetNewPassword />);
  //   await act(async () => {
  //     fireEvent.input(screen.getByTestId('new-password'), {
  //       target: { value: 'password123' },
  //     });
  //     fireEvent.input(screen.getByTestId('confirm-password'), {
  //       target: { value: 'password123' },
  //     });
  //   });

  //   fireEvent.click(screen.getByText('Update'));

  //   await waitFor(() => {
  //     expect(mockSetNewPassword).toHaveBeenCalledWith({
  //       email: 'test@example.com',
  //       password: 'password123',
  //       password2: 'password123',
  //     });
  //     expect(mockedUsedNavigate).toHaveBeenCalledWith('/congratulations');
  //   });
  // });

  // it('shows error message if password reset fails', async () => {
  //   mockSetNewPassword.mockResolvedValue(false);
  //   renderWithRouter(<SetNewPassword />);
  //   await act(async () => {
  //     fireEvent.input(screen.getByTestId('new-password'), {
  //       target: { value: 'password123' },
  //     });
  //     fireEvent.input(screen.getByTestId('confirm-password'), {
  //       target: { value: 'password123' },
  //     });
  //   });
  //   fireEvent.click(screen.getByText('Update'));

  //   await waitFor(() => {
  //     expect(mockSetNewPassword).toHaveBeenCalled();
  //     expect(mockedUsedNavigate).not.toHaveBeenCalled();
  //   });
  // });
});
