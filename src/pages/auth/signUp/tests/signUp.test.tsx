import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignUp from '../SignUp';
import { useNavigate } from 'react-router-dom';

// Setup Axios mock adapter
const mock = new MockAdapter(axios);

// Mock navigate function
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SignUp', () => {
  beforeEach(() => {
    mock.reset();
    localStorage.clear(); // Clear localStorage before each test
  });

  //Test Case 1 - Rendering the SignUp Form

  it('renders the Sign Up form', () => {
    renderWithRouter(<SignUp />);

    expect(screen.getByText("Get's Started!")).toBeInTheDocument();
    expect(screen.getByTestId("first-name")).toBeInTheDocument();     //Passing TestId
    expect(screen.getByTestId("last-name")).toBeInTheDocument();      //Passing TestId    
    expect(screen.getByTestId("user-email")).toBeInTheDocument();     //Passing TestId
    expect(screen.getByTestId("create-pwd")).toBeInTheDocument();     //Passing TestId 
    expect(screen.getByTestId("confirm-pwd")).toBeInTheDocument();    //Passing TestId
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  //Test Case 2 - Validation Error When Mandotory fields does not entered

  it('shows validation error when required fields are not entered', async () => {
    renderWithRouter(<SignUp />);

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
      expect(screen.getByText("Last name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(screen.getByText("Please confirm your password")).toBeInTheDocument();
    });
  });

  //Test Case 3 - Validation error for an Invalid Email

  it('shows validation error for invalid email address', async () => {
    renderWithRouter(<SignUp />);

    fireEvent.input(screen.getByTestId("user-email"), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });


  //Test Case 4 - Validation error when Password is Mismatching

  it('shows validation error for password mismatch', async () => {
    renderWithRouter(<SignUp />);

    fireEvent.input(screen.getByTestId("create-pwd"), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByTestId("confirm-pwd"), {
      target: { value: 'differentpassword' },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });
});
