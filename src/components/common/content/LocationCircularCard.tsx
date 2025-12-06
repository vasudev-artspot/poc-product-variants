import React from "react";
import { IMAGE_PREFIX_URL } from "../../../constant/constant";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./LocationCircularCard.css";

interface LocationCircularCardProps {
  location: any;
  index?: number;
  onEditClick?: (id: number) => void;
}

export const LocationCircularCard: React.FC<LocationCircularCardProps> = ({
  location,
  index,
  onEditClick,
}) => {
  const image = location.image?.trim() ? location.image : null;
  const imageUrl = image && `${IMAGE_PREFIX_URL}/l/${image}_1024.webp`;
  const initials = getLocationInitials(location.name);

  return (
    <Box className="mainCard">
      <Box className="imageWrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={location.name}
            className="locationImage"
          />
        ) : (
          <Box className="placeholder">
            <Typography className="placeholderText">{initials}</Typography>
          </Box>
        )}
        {onEditClick && (
          <Box className="locationOverlay">
            <IconButton
              className="editIconButton"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(location.id);
              }}
            >
              <EditIcon sx={{ color: "#d32f2f" }} />
            </IconButton>
          </Box>
        )}
      </Box>
      <Typography className="cityName">{location.name}</Typography>
    </Box>
  );
};

  /** Returns initials from a location name */
export const getLocationInitials = (name: string = "") => {
    if (!name) return "NA";
    const words = name.trim().split(" ");
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };