import React from "react";
import { Button as MUButton } from "@mui/material";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "inherit" | "success" | "error" | "info" | "warning";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = "contained",
  color = "primary",
  disabled = false,
  type = "button",
}) => {
  return (
    <MUButton
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
      type={type}
      sx={{textTransform: 'none'}}
    >
      {children}
    </MUButton>
  );
};

export default Button;
