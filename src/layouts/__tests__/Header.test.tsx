import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Header from "../Header";

describe("Header component", () => {
  test("renders without crashing", () => {
    render(<Header onToggleSidebar={() => {}} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  test("should call onToggleSidebar when the hamburger menu button is clicked", () => {
    const mockToggleSidebar = jest.fn();
    render(<Header onToggleSidebar={mockToggleSidebar} />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle sidebar/i,
    });
    fireEvent.click(toggleButton);

    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  test("renders icons and images", () => {
    render(<Header onToggleSidebar={() => {}} />);

    const icons = screen.getAllByRole("img", { hidden: true });
    expect(icons).toHaveLength(6);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  test("renders profile image", () => {
    render(<Header onToggleSidebar={() => {}} />);
    const profileImages = screen.getAllByAltText("Profile");
    expect(profileImages).toHaveLength(1);
  });

  test("renders divider image", () => {
    render(<Header onToggleSidebar={() => {}} />);
    const dividerImage = screen.getByAltText("Divider");
    expect(dividerImage).toBeInTheDocument();
  });
});
