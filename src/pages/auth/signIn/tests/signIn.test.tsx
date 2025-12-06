import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignIn from '../SignIn';
import AuthService from '../../../../services/auth/AuthService';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '../../../../contexts/AuthContext';

// Setup Axios mock adapter
const mock = new MockAdapter(axios);

// Mock navigate function
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock AuthService
const mockAuthService = {
  loginUser: jest.fn(),
  isUserLoggedIn: jest.fn(),
};

jest.mock('../../../../services/auth/AuthService', () => ({
  __esModule: true,
  default: {
    getInstance: () => mockAuthService,
  },
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
};

describe('SignIn', () => {
  beforeEach(() => {
    mock.reset();
    localStorage.clear(); // Clear localStorage before each test
    jest.clearAllMocks(); // Clear all mock data
  });

  //Test Case 1 - Rendering SignIn Form

  it('renders the Sign In form', () => {
    renderWithProviders(<SignIn />);

    expect(screen.getByText("Welcome Back !")).toBeInTheDocument();
    expect(screen.getByTestId("user-email")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-pwd")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  //Test Case 2 - Validation Error when mandatory Fields are not entered

  it('shows validation error when required fields are not entered', async () => {
    renderWithProviders(<SignIn />);

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  //Test Case 3 - Validation Error for an Invalid Email Address

  it('shows validation error for invalid email address', async () => {
    renderWithProviders(<SignIn />);

    fireEvent.input(screen.getByTestId("user-email"), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  //Test Case 4 - Validation Error when user submits the form and redirecting to Article Content Flow

  it('submits the form and redirects to Article Content page', async () => {
    mockAuthService.loginUser.mockResolvedValue(true);

    renderWithProviders(<SignIn />);

    fireEvent.input(screen.getByTestId("user-email"), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByTestId("confirm-pwd"), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockAuthService.loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });
});
