import React, { useState, useEffect } from "react";
import { TextField, Box, IconButton, Typography } from "@mui/material";
import Badge from "../Badge/Badge";
import AddIcon from "@mui/icons-material/Add";
import { UseFormRegister } from "react-hook-form";

export interface Option {
  label: string;
  value: string | number;
}

interface SearchSelectProps {
  shrink?: boolean;
  label: string;
  name: string;
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder: string;
  error: boolean;
  errorMessage?: string;
  testId?: string;
  updateOptionData: (category: any) => void;
  fetchOptions: (searchText: string) => Promise<Option[]>;
  register: UseFormRegister<any>;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  shrink,
  label,
  name,
  value = [],
  onChange,
  placeholder,
  error,
  errorMessage,
  testId,
  updateOptionData,
  fetchOptions,
  register,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState("");
  const selectedValues = Array.isArray(value) ? value : [];
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setInputValue(searchText);
    if (searchText.length >= 3) {
      const newOptions = await fetchOptions(searchText);
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  const handleAddOption = async (option: Option) => {
    if (!selectedValues.some((selected) => selected.value === option.value)) {
      const newValue = [...selectedValues, option];
      let catValue = option.label;
      await updateOptionData(catValue);
      onChange(newValue);
    }

    setInputValue("");
    setOptions([]);
  };

  const handleRemoveOption = (option: Option) => {
    const newValue = selectedValues.filter(
      (selected) => selected.value !== option.value
    );
    onChange(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "16px"}}>
      <TextField
        {...register(name)}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        variant="outlined"
        placeholder={placeholder}
        fullWidth
        InputLabelProps={{ shrink: shrink }}
        margin="normal"
        error={error}
        helperText={error ? errorMessage : undefined}
        inputProps={{
          "data-testid": testId,
        }}
      />

      {/* Dropdown List */}

      {options.length > 0 && (
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            maxHeight: "150px",
            overflowY: "auto",
            marginBottom: "8px",
          }}
        >
          {options.map((option) => (
            <Box 
              key={option.value}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <Typography
                variant="body2"
                onClick={() => setInputValue(option.label)}
              >
                {option.label}
              </Typography>
              <IconButton
                onClick={() => handleAddOption(option)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Selected Categories */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {selectedValues.map((category) => (
          <Badge
            key={category.value}
            label={category.label}
            showCloseButton
            onClose={() => handleRemoveOption(category)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SearchSelect;
