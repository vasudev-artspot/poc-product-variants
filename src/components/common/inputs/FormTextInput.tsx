import { Controller, Control } from "react-hook-form";
import { TextField, FormLabel } from "@mui/material";

interface FormInputProps {
  name: string;
  control?: Control<any>;
  label?: string;
  defaultValue?: string;
  rules?: any;
  errors?: any;
  testId?: string;
}

const FormTextInput = ({
  name,
  control,
  label,
  defaultValue,
  rules,
  testId,
}: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error }, formState }) => (
        <div>
          <FormLabel>{label}</FormLabel>
          <div></div>
          <TextField
            // helperText={error ? error.message : null}
            size='small'
            error={!!error}
            onChange={onChange}
            value={defaultValue}
            variant='outlined'
            inputProps={{
              "data-testid": testId,
            }}
          />
          {error && <div>{error.message}</div>}
        </div>
      )}
    />
  );
};

export default FormTextInput;
