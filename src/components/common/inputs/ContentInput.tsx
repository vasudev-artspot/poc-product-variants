import React from "react";
import { TextField } from "@mui/material";

const ContentInput: React.FC<{
  value: string | string[] | undefined;
  onChange: (value: string) => void;
  label?: string;
}> = ({ value, onChange, label }) => {
  return (
    <TextField
      fullWidth
      label={label ? label : "Content"}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiline
      rows={8}
      InputProps={{
        style: { fontSize: "16px" },
      }}
      margin="normal"
    />
  );
};

export default ContentInput;
