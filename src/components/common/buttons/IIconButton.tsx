import React, { ReactNode } from "react";
import { IconButton as MUIButton } from "@mui/material";

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
}

const IIconButton: React.FC<IconButtonProps> = ({ icon, onClick }) => {
  return (
    <MUIButton onClick={onClick} style={{ color: '#000' }}>
      { icon }
    </MUIButton>
  );
};

export default IIconButton;