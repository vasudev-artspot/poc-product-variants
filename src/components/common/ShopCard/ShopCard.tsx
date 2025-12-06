import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShopImage1 from "../../../assets/images/ShopImageOne.png";

interface ShopCardProps {
  shopName: string;
  onClick: () => void;
  onDelete?: () => void; // Optional delete function
  showDelete?: boolean; // Whether to show delete button
}

const ShopCard: React.FC<ShopCardProps> = ({ shopName, onClick, onDelete, showDelete }) => {
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
        cursor: "pointer",
        position: "relative", // Needed for delete button positioning
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={ShopImage1}
        alt={shopName}
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
            WebkitLineClamp: 1, // Limits to 1 line
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: "4.5em", 
          }}
        >
          {shopName}
        </Typography>
      </Box>

      {/* Show delete icon only when hovered and only in selected shops list */}
      {showDelete && isHovered && onDelete && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click
            onDelete();
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "white",
            ":hover": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      )}
    </Box>
  );
};

export default ShopCard;
