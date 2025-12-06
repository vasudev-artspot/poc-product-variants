import React from "react";
import { TextField, IconButton, Box, FormHelperText } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Badge from "../Badge/Badge";
import PlusIcon from "../../../assets/Icons/PlusIcon.png";

interface TagInputProps {
  shrink?: boolean;
  label: string;
  name: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  testId?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  shrink,
  label,
  name,
  value = [],
  onChange,
  error,
  errorMessage,
  placeholder,
  testId,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleAddTag = () => {
    if (inputValue.trim() && !value.includes(inputValue)) {
      const newTags = [...value, inputValue.trim()];
      onChange?.(newTags);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onChange?.(newTags);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          label={label}
          variant="outlined"
          placeholder={placeholder}
          value={inputValue}
          InputLabelProps={{ shrink: shrink }}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
          sx={{ flex: 1 }}
          inputProps={{ "data-testid": testId }}
          error={error}
          helperText={error ? errorMessage : undefined}
        />
        <IconButton onClick={handleAddTag} data-testid={`${testId}-add-button`}>
          <img src={PlusIcon} alt="Add Icon" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {value.map((tag) => (
          <Badge
            key={tag}
            label={tag}
            showCloseButton
            onClose={() => handleRemoveTag(tag)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagInput;
