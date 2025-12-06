import React, { ReactNode } from "react";

interface Tab {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange?: (value: string) => void;
  children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, children }) => {
  const handleTabClick = (tab: Tab) => {
    if (tab.disabled) return; 
    if (tab.value !== activeTab) {
      onTabChange?.(tab.value);
    }
  };

  return (
    <div>
      <div className="flex gap-x-24 p-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab)}
            disabled={tab.disabled}
            className={`py-2 ${
              tab.disabled
                ? "text-gray-400 cursor-not-allowed"
                : activeTab === tab.value
                ? "border-b-2 border-blue-500 text-blue-500 font-bold font-medium text-base"
                : "text-blue-400 border-transparent border-b-2"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {React.Children.map(children, (child) =>
          React.isValidElement(child) && child.props.value === activeTab ? child : null
        )}
      </div>
    </div>
  );
};

export default Tabs;
