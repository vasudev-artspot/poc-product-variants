import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface SearchableSelectProps {
  options: { label: string; value: string | number }[];
  placeholder?: string;
  value?: { label: string; value: string | number } | null;
  onChange: (value: { label: string; value: string | number } | null) => void;
  isError?: boolean;
  disabled?: boolean;
  onSearch: (
    searchText: string
  ) => Promise<{ label: string; value: string | number }[]>;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder,
  value = null,
  onChange,
  isError = false,
  disabled = false,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = async (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);

    if (newInputValue) {
      const newOptions = await onSearch(newInputValue);
    }
  };

  return (
    <Autocomplete
      disablePortal
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      disabled={disabled}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          error={isError}
          className={`bg-white border border-gray-100 rounded-md text-black
            focus:ring-2 focus:ring-blue-500 focus:outline-none 
            px-3 py-2 text-sm 
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      )}
      classes={{
        option: "text-sm px-3 py-2 hover:bg-blue-100 cursor-pointer",
        noOptions: "text-gray-500 px-3 py-2",
        popper: "bg-white border border-gray-100 rounded-lg shadow-lg",
      }}
      className='w-full max-w-md mb-4'
    />
  );
};

export default SearchableSelect;
