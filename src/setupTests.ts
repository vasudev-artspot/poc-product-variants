// Extend Jest with React Testing Library matchers
import '@testing-library/jest-dom';

// Globally mock react-query's useMutation (optional, if you want default mock)
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: jest.fn(),
}));
