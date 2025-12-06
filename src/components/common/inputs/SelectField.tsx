import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { UseFormRegister } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";



// interface SelectFieldProps {
//   label: string;
//   name: string;
//   register: UseFormRegister<any>;
//   required?: string;
//   options: { value: string | number; label: string }[];
//   error: boolean;
//   errorMessage?: string;
//   testId?: string;
//   defaultValue?: string | number;
//   onChange?: (
//     event: SelectChangeEvent<string | number>,
//     child: React.ReactNode
//   ) => void;
//   value?: string;
// }

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// const SelectField: React.FC<SelectFieldProps> = ({
//   label,
//   name,
//   register,
//   required,
//   options,
//   error,
//   errorMessage,
//   testId,
//   defaultValue,
//   onChange,
//   value,
// }) => {
//   return (
//     <div>
//       <FormControl fullWidth margin="normal" error={error}>
//         <InputLabel id={label}>{label}</InputLabel>
//         <Select
//           labelId={label}
//           input={<OutlinedInput label={label} />}
//           MenuProps={MenuProps}
//           defaultValue={defaultValue || ""}
//           {...register(name, { required })}
//           inputProps={{
//             "data-testid": testId,
//           }}
//           onChange={onChange}
//           value={value}
//         >
//           {options.map((option) => (
//             <MenuItem key={option.value} value={option.value}>
//               {option.label}
//             </MenuItem>
//           ))}
//         </Select>
//         {error && <FormHelperText>{errorMessage}</FormHelperText>}
//       </FormControl>
//     </div>
//   );
// };

// Update your SelectField component props
interface SelectFieldProps {
  label: string;
  name: string;
  register?: UseFormRegister<any>; // Make register optional
  required?: string;
  options: { value: string | number; label: string }[];
  error: boolean;
  errorMessage?: string;
  defaultValue?: string | number;
  testId?: string;
  value?: string | number; // Add value prop
  onChange?: (event: SelectChangeEvent<string | number>) => void; // Add onChange prop
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Update the SelectField component implementation
const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  register,
  required,
  options,
  error,
  errorMessage,
  defaultValue,
  testId,
  value,
  onChange,
}) => {
  return (
    <div>
      <FormControl fullWidth margin="normal" error={error}>
        <InputLabel id={label}>{label}</InputLabel>
        <Select
          labelId={label}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
          value={value || ''}
          inputProps={{
            "data-testid": testId,
          }}
          onChange={onChange}
          name={name}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default SelectField;
