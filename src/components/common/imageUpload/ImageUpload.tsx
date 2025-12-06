import React, { useState } from "react";
import { Box, Typography, IconButton, CircularProgress, Card, CardMedia, CardActions } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { v2 as cloudinary } from "cloudinary";

interface ImageUploadComponentProps {
  uniqueId: string;
  onImageUpload: (imageUrls: string[]) => void;
  existingImages?: string[];
}

const ImageUpload: React.FC<ImageUploadComponentProps> = ({ uniqueId, onImageUpload, existingImages = [] }) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert("Some files were rejected due to invalid type or size.");
    }

    if (validFiles.length > 0) {
      setLoading(true);
      try {
        const uploadedUrls = await uploadImagesToCloudinary(validFiles);
        const newImages = [...images, ...uploadedUrls];
        setImages(newImages);
        onImageUpload(newImages);
      } catch (error) {
        alert("Failed to upload images.");
      } finally {
        setLoading(false);
      }
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "u8ecpdxc");

      const response = await fetch(`https://api.cloudinary.com/v1_1/dpiwq3aqv/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message);
      }

      return data.secure_url;
    });
    return Promise.all(uploadPromises);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImageUpload(updatedImages);
  };

  return (
    <Box>
      {/* <Typography variant="h6" mb={2}>Upload Images</Typography> */}
      <Box
        // sx={{
        //   border: "2px dashed #ccc",
        //   borderRadius: "8px",
        //   padding: "16px",
        //   textAlign: "center",
        //   cursor: "pointer",
        // }}
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          hidden
          id={uniqueId}
          onChange={handleFileChange}
        />
        <label htmlFor={uniqueId} style={{ display: "block", cursor: "pointer" }}>
          <CloudUploadIcon fontSize="small" color="action" />
          {/* <Typography variant="body1" color="textSecondary">
            Click to upload image
          </Typography> */}
        </label>
      </Box>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
        {images.map((image, index) => (
          <Card key={index} sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              image={image}
              alt={`Uploaded ${index}`}
              sx={{ width: "100%", height: "100%" }}
            />
            <CardActions sx={{ justifyContent: "center", padding: 0 }}>
              <IconButton
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "#fff",
                  borderRadius: "50%",
                  ':hover': {
                    background: "#f5f5f5",
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ImageUpload;
