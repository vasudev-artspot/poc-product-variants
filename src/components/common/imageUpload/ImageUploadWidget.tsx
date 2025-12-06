import React, { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageUploadWidgetProps {
  id: string;
  name: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onBlur: () => void;
  error?: string;
  multiple?: boolean;
}

const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  multiple = false,
}) => {

  console.log("value =>", value);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(Array.isArray(value) ? value : []);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrorState("Some files were rejected due to invalid type or size");
      return;
    }

    setErrorState(null);
    setLoading(true);

    try {
      const urls = await uploadImagesToCloudinary(validFiles);
      const updatedUrls = multiple
        ? [...uploadedUrls, ...urls]
        : [urls[0]];

      setUploadedUrls(updatedUrls);
      onChange(multiple ? updatedUrls : updatedUrls[0]);
    } catch {
      setErrorState("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "u8ecpdxc");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dpiwq3aqv/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message);
      }

      return data.secure_url;
    });

    return Promise.all(uploadPromises);
  };

  const getUploadMessage = () => {
    if (loading) {
      return "Uploading...";
    }
    
    if (multiple && value.length > 0) {
      return `${uploadedUrls.length} file(s) uploaded`
    } else if (!multiple && value) {
      return "1 file uploaded";
    } else {
      return "Upload Image";
    }
  };

  return (
    <Box sx={{ width: "100%", marginTop: "0.5rem", marginBottom: "1rem" }}>
      <Box
        sx={{
          border: "2px dashed #ccc",
          padding: "1rem",
          textAlign: "center",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        <IconButton component="label">
          <CloudUploadIcon sx={{ fontSize: "2rem", color: "#aaa" }} />
          <input
            type="file"
            id={id}
            name={name}
            hidden
            onChange={handleFileChange}
            onBlur={onBlur}
            multiple={multiple}
            accept="image/jpeg, image/png, image/webp"
          />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {getUploadMessage()}
        </Typography>
        {loading && <CircularProgress size={24} />}
        {errorState && (
          <Typography variant="body2" color="error">
            {errorState}
          </Typography>
        )}
      </Box>
      {error && (
        <Typography 
          variant="caption"
          sx={{
            display: 'block',
            marginTop: '3px',
            marginRight: "14px",
            marginLeft: "14px"
          }}
          color="error"
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploadWidget;
