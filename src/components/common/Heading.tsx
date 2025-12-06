import React from "react";
import { Typography, Box } from "@mui/material";

interface HeadingProps {
  label: string;
  required?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ label, required = false }) => {
  return (
    <Box>
      <Typography
        variant='h6'
        sx={{
          display: "inline-flex",
          alignItems: "center",
          marginBottom: required ? "8px" : "0",
          fontWeight: "bold",
        }}
      >
        {label}
        {required && (
          <Typography component='span' color='error' sx={{ marginLeft: "4px" }}>
            *
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

export default Heading;
