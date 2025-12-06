import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./setNewPasswordStyles";
import InputField from "../../../components/common/inputs/InputField";
import { IResetPasswordInfo } from "../../../services/auth/types";
import ForgotPasswordService from "../../../services/auth/ForgotPasswordService";

const SetNewPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IResetPasswordInfo>();

  // Define the success and error flags
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit: SubmitHandler<IResetPasswordInfo> = async (data) => {
    try {
      var email = localStorage.getItem("forgotPasswordEmail");

      if (email) {
        data.email = email;
        const forgotPasswordServiceInstance = new ForgotPasswordService();
        const result = await forgotPasswordServiceInstance.setNewPassword(data);
        console.log(result);
        if (result) {
          // Save email to localStorage
          setSuccess(true);
          setError(false);
          setErrorMessage("");
          localStorage.setItem("forgotPasswordEmail", data.email);
          navigate("/congratulations");
        } else {
          setSuccess(false);
          setError(true);
          setErrorMessage("Error reseting password");
        }
      }
    } catch (error) {
      console.error("Forgot password request failed:", error);
      // Save email to localStorage
      setSuccess(false);
      setError(true);
      setErrorMessage("");
    }
  };

  return (
    <Box sx={styles.container}>
      <Grid item sx={styles.formContainer}>
        <Typography variant='h4' sx={styles.title}>
          Set a New Password
        </Typography>
        <Typography variant='body1' sx={styles.subtitle}>
          Create a new password. Ensure it differs from previous ones for security.
        </Typography>

        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={styles.form}>
          <InputField
            label='New Password'
            name='password'
            type='password'
            register={register}
            required='New password is required'
            placeholder='Enter new password'
            error={!!errors.password}
            errorMessage={errors.password?.message}
            testId={"new-password"}
          />
          <InputField
            label='Confirm Password'
            name='password2'
            type='password'
            register={register}
            required='Please confirm your new password'
            placeholder='Confirm new password'
            validate={(value) =>
              value === watch("password") || "Passwords do not match"
            }
            error={!!errors.password2}
            errorMessage={errors.password2?.message}
            testId={"confirm-password"}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={styles.submitButton}
          >
            Update
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default SetNewPassword;
