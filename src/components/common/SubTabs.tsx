import React, { ReactNode } from "react";

interface SubTabs {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabsProps {
  subTabs: SubTabs[];
  activeTab: string;
  onTabChange?: (value: string) => void;
  children: ReactNode;
}

const SubTabs: React.FC<TabsProps> = ({ subTabs, activeTab, onTabChange, children }) => {
  const handleTabClick = (value: string) => {
    if (value !== activeTab) {
      if (onTabChange) onTabChange(value);
    }
  };

  return (
    <div>
      <div className="flex gap-x-8">
        {subTabs.map((subTab) => (
          <button
            key={subTab.value}
            onClick={() => handleTabClick(subTab.value)}
            disabled={subTab.disabled}
            className={`py-2 ${
              subTab.disabled
                ? "text-gray-400 cursor-not-allowed"
                : activeTab === subTab.value
                ? "border-b-2 border-black text-black font-bold"
                : "text-blue-400 border-transparent border-b-2"
            }`}
          >
            {subTab.label}
          </button>
        ))}
      </div>
      <div className="">
        {React.Children.map(children, (child) =>
          React.isValidElement(child) && child.props.value === activeTab ? child : null
        )}
      </div>
    </div>
  );
};

export default SubTabs;
