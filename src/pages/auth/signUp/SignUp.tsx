import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Box, Typography, Grid } from "@mui/material";
import styles from "./signUpStyles";
import InputField from "../../../components/common/inputs/InputField";
import axiosAuthClient from "../../../services/auth/AuthAxiosClient";
import { IUserInfo } from "../../../services/auth/types";
import { useNavigate } from "react-router-dom";
import RegistrationService from "../../../services/auth/RegistrationService";
import Toast from "../../../components/toast/Toast";

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IUserInfo>();

  // Define the success and error flags
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IUserInfo> = async (data: IUserInfo) => {
    // TODO : Register User through AXIOS API
    data.userType = "contributor";
    console.log(data);

    try {
      const registerServiceInstance = new RegistrationService();
      const success = await registerServiceInstance.registerUser(data);

      if (success) {
        setError(false);
        setErrorMessage("");
        setSuccess(true);
        localStorage.setItem("signUpEmail", data.email);
        localStorage.setItem("registrationSuccess", "true");
        setToastType("success");
        setToastMessage("Registration Successful");
        setToastOpen(true);
        navigate("/sign-in");
      } else {
        setSuccess(false);
        setError(true);
        setErrorMessage(
          "Registration Failed Due to Incorrect Data. Please try later or contact admin team"
        );
      }

      // Handle successful login i.e; redirect to another page.
    } catch (error) {
      console.error("Registration failed:", error);
      setError(true);
      setErrorMessage(
        "Registration Failed. Server Error , please try again later"
      );
      setToastType("error");
      setToastMessage(
        "Registration Failed. Server Error, please try again later"
      );
      setToastOpen(true);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: "#EBEFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Toast
        message={toastMessage}
        type={toastType}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
      {/* {error && <div>{errorMessage}</div>}
      {!error && errorMessage && <div>{errorMessage}</div>} */}
      <Grid container sx={styles.container}>
        <Grid item xs={12} md={6} sx={styles.formContainer}>
          <Typography variant='h4' sx={styles.title}>
            Get's Started!
          </Typography>
          <Typography variant='body1' sx={styles.subtitle}>
            Please fill out the form to register
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={styles.form}
          >
            <InputField
              label='First Name'
              name='firstName'
              register={register}
              required='First name is required'
              placeholder='Enter First Name'
              error={!!errors.firstName}
              errorMessage={errors.firstName?.message}
              testId={"first-name"}
              allowSpaces={false}
            />
            <InputField
              label='Last Name'
              name='lastName'
              register={register}
              required='Last name is required'
              placeholder='Enter Last Name'
              error={!!errors.lastName}
              errorMessage={errors.lastName?.message}
              testId={"last-name"}
              allowSpaces={false}
            />
            <InputField
              label='Email'
              name='email'
              register={register}
              required='Email is required'
              placeholder='Enter Email ID'
              pattern={{
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              }}
              error={!!errors.email}
              errorMessage={errors.email?.message}
              testId={"user-email"}
              allowSpaces={false}
            />
            <InputField
              label='Create Password'
              name='password'
              type='password'
              register={register}
              required='Password is required'
              placeholder='Create Password'
              minLength={{
                value: 6,
                message: "Password must be at least 6 characters long",
              }}
              error={!!errors.password}
              errorMessage={errors.password?.message}
              testId={"create-pwd"}
              allowSpaces={false}
            />
            <InputField
              label='Confirm Password'
              name='password2'
              type='password'
              register={register}
              required='Please confirm your password'
              placeholder='Confirm Password'
              validate={(value) =>
                value === watch("password") || "Passwords do not match"
              }
              error={!!errors.password2}
              errorMessage={errors.password2?.message}
              testId={"confirm-pwd"}
              allowSpaces={false}
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              sx={styles.submitButton}
            >
              Sign Up
            </Button>
            <Typography variant='body2' sx={styles.signInText}>
              Already have an account?{" "}
              <a
                href='/sign-in'
                style={{ color: "#246EE9", textDecoration: "underline" }}
              >
                Sign In
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUp;
