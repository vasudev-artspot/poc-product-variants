import React from "react";
import { TextField } from "@mui/material";

const TitleInput: React.FC<{
  value: string | string[] | undefined;
  onChange: (e: any) => void;
  size: string;
  label: string;
}> = ({ value, onChange, size, label }) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
      InputProps={{
        style: { fontSize: size, fontWeight: "bold" },
      }}
      margin="normal"
    />
  );
};

export default TitleInput;
