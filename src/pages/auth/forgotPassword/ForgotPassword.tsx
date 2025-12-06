import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import ForgotPasswordService from "../../../services/auth/ForgotPasswordService";
import { IForgotPasswordUserInfo } from "../../../services/auth/types";
import styles from "./forgotPasswordStyles";

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordUserInfo>();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit: SubmitHandler<IForgotPasswordUserInfo> = async (data) => {
    try {
      const forgotPasswordServiceInstance = new ForgotPasswordService();
      const success = await forgotPasswordServiceInstance.verifyEmail(data);

      if (success) {
        localStorage.setItem("forgotPasswordEmail", data.email);
        navigate("/verify-code");
      } else {
        setError(true);
        setErrorMessage("User account does not exist");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(
        "Forgot password request failed, User account does not exist"
      );
    }
  };

  return (
    <Box sx={styles.page}>
      <Box sx={styles.formContainer}>
        <Typography sx={styles.title}>Forgot Password</Typography>
        <Typography sx={styles.subtitle}>
          Please enter the registered email-id to reset your password
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={styles.form}>
          <TextField
            label="Email *"
            variant="outlined"
            fullWidth
            placeholder="Enter your registered email"
            data-testid="topic-email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#888888" }} />
                </InputAdornment>
              ),
            }}
            sx={styles.input}
          />

          <Button type="submit" variant="contained" fullWidth sx={styles.submitButton}>
            Continue
          </Button>

          {error && (
            <Typography sx={styles.errorMessage}>{errorMessage}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
