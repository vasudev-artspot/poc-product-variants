import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleImage from "../../../assets/images/ArticleImage.png"

interface ArticleCardProps {
  introText: string;
  onClick: () => void;
  onDelete?: () => void; // Optional delete function
  showDelete?: boolean; // Whether to show delete button
}

const ArticleCard: React.FC<ArticleCardProps> = ({ introText, onClick, onDelete, showDelete }) => {
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
        src={ArticleImage}
        alt={introText}
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
            WebkitLineClamp: 3, // Limits to 3 lines
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: "4.5em", // Approx height for 3 lines
          }}
        >
          {introText}
        </Typography>
      </Box>

      {/* Show delete icon only when hovered and only in selected articles list */}
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

export default ArticleCard;
