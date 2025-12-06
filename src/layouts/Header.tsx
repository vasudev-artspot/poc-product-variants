import React, { useState } from "react";
import Profile from "../assets/images/user-297566_640.webp";
import Divider from "../assets/images/divider-vertical.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faTableCellsLarge,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext"; // Import the Auth context

interface Props {
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logoutUser } = useAuth(); // Get the logout function from Auth context

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logoutUser(); // Call the logout function
  };

  return (
    <header className="sticky top-0 flex items-center justify-between p-4 bg-white shadow-md z-50 flex-shrink-0">
      <button
        className="text-gray-600"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-6">
          {/* <span>
            <FontAwesomeIcon icon={faTableCellsLarge} />
          </span>
          <span>
            <FontAwesomeIcon icon={faClock} />
          </span>
          <span>
            <FontAwesomeIcon icon={faBell} />
          </span>
          <img src={Divider} alt="Divider" className="w-8 h-8 rounded-full" /> */}
          <div className="relative">
            <img
              src={Profile}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={handleProfileClick}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg">
                <button
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
