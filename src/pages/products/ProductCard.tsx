import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LampImage from "../../assets/images/LampImage.jpg";

interface ProductCardProps {
  productName: string;
  productImage?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  productName, 
  productImage, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "250px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={productImage || LampImage}
        alt={productName}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "0.5rem",
        }}
      />
      <Box sx={{ textAlign: "left" }}>
        <Typography
          variant="h6"
          sx={{
            mb: 0.5,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {productName}
        </Typography>
      </Box>

      {/* Action buttons */}
      {showActions && isHovered && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 1,
          }}
        >
          {onEdit && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{
                backgroundColor: "white",
                ":hover": { backgroundColor: "rgba(0, 0, 255, 0.1)" },
              }}
            >
              <EditIcon color="primary" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                console.log('Delete button clicked for product:', productName);
                onDelete();
              }}
              sx={{
                backgroundColor: "white",
                ":hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
              }}
            >
              <DeleteIcon color="error" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProductCard;