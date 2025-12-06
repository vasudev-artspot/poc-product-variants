import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import successGif from "../../../assets/Success.gif"; 
const Congratulations: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/sign-in");
  };

  return (
    <Box
      sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",background: "#EBEFFF"}}
    >
      <img src={successGif} alt="Success" style={{ width: "150px", height: "150px" }} />
      <Typography variant="h4" sx={{ margin: "20px 0" }}>
        Congratulations!
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Your password has been changed. Click continue to login.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleContinue}>
        Continue
      </Button>
    </Box>
  );
};

export default Congratulations;
