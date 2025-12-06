import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import {
  faBox,
  faProjectDiagram,
  faFileAlt,
  faClipboard,
  faCommentDots,
  faTableCellsLarge,
  faStore,
  faLocationDot
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  isOpen: boolean;
}

const menuItems = [
  { name: "Products", icon: faBox, link: "/" },
];

const Sidebar: React.FC<Props> = ({ isOpen }) => {
  return (
    <div
      className={`bg-white h-[calc(100vh-64px)] rounded-tr-[100px] shadow-lg flex-shrink-0 overflow-hidden ${
        isOpen ? "w-64" : "w-14 hidden"
      }`}
    >
      <div className="p-5 h-full overflow-y-auto">
        <h2 className="mb-5 text-xs uppercase">
          <b>{isOpen && "Main Menu"}</b>
        </h2>
        <ul className="list-none p-0">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="flex items-center mb-5 cursor-pointer text-base"
            >
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  [
                    "focus-within:text-blue-500 hover:text-blue-500 flex items-center",
                    isActive ? "text-blue-500" : null,
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2.5" />
                <span className={`${isOpen ? "" : "hidden"}`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
