import { render, screen } from "@testing-library/react";
import App from "./App";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";

test("renders learn react link", () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
