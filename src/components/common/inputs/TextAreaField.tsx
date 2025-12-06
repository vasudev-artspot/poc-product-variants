import React from "react";
import { Box, TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface TextAreaFieldProps {
  shrink?: boolean;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  required?: string;
  placeholder?: string;
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  validate?: (value: string) => boolean | string;
  error: boolean;
  errorMessage?: string;
  testId?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  rows?: number;
  showValidationMessage?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  shrink,
  label,
  name,
  register,
  required,
  placeholder,
  minLength,
  maxLength,
  validate,
  error,
  errorMessage,
  testId,
  defaultValue,
  onChange,
  value,
  rows = 4,
  showValidationMessage = false,
}) => {
  return (<Box sx={{marginBottom:"32px"}}>
    <TextField
      label={label}
      placeholder={placeholder}
      variant="outlined"
      margin="normal"
      sx={{ width: "100%"}}
      InputLabelProps={{ shrink: shrink }}
      multiline
      rows={rows}
      {...register(name, {
        required,
        minLength,
        maxLength,
        validate,
      })}
      error={error}
      helperText={error ? errorMessage : undefined}
      inputProps={{
        "data-testid": testId,
      }}
      defaultValue={defaultValue}
      onChange={onChange}
      value={value}
    />
    {showValidationMessage && <Box sx={{padding: '0px', fontWeight: '400', fontSize: "10px", lineHeight: "100%", marginTop: '8px', color: "#6D6D6D"}}>Minimum length is 25-30 characters. </Box>}
  </Box>);
};

export default TextAreaField;
