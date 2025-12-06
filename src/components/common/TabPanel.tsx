import React, { ReactNode } from "react";

interface TabPanelProps {
  value: string;
  children: ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ value, children }) => {
  return <div data-value={value}>{children}</div>;
};

export default TabPanel;
