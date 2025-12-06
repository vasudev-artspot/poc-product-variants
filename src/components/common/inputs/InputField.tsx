import React from "react";
import { TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  shrink?: boolean;
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  required?: string;
  placeholder?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  validate?: (value: string) => boolean | string;
  error: boolean;
  errorMessage?: string;
  testId?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  allowSpaces?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  shrink,
  label,
  name,
  type = "text",
  register,
  required,
  placeholder,
  pattern,
  minLength,
  validate,
  error,
  errorMessage,
  testId,
  defaultValue,
  onChange,
  value,
  allowSpaces = true,
}) => {
  return (
    <TextField
      label={label}
      type={type}
      placeholder={placeholder}
      variant="outlined"
      margin="normal"
      sx={{ width: "100%", marginBottom: "2rem" }}
      InputLabelProps={{ shrink: shrink }}
      {...register(name, {
        required,
        pattern,
        minLength,
        validate,
      })}
      error={error}
      helperText={error ? errorMessage : undefined}
      inputProps={{
        "data-testid": testId,
      }}
      defaultValue={defaultValue}
      {...(value !== undefined ? { value } : {})}
      {...(onChange ? { onChange } : {})}
      onKeyDown={(e) => {
        if (!allowSpaces && e.key === " ") {
          e.preventDefault();
        }
      }}
      onBlur={(e) => {
        e.target.value = e.target.value.trim();
      }}
    />
  );
};

export default InputField;
