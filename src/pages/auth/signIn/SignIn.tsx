import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Box, Typography, Grid } from "@mui/material";
import styles from "./signInStyles";
import InputField from "../../../components/common/inputs/InputField";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/toast/Toast";

interface LoginFormInput {
  email: string;
  password: string;
  product: string;
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();

  const auth = useAuth();
  const navigate = useNavigate();

  // Define the success & error flags
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");

  const { loginUser, isUserLoggedIn } = auth;

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      // Set Authenticated State
      data.product = "WEB_CONTENT_CREATOR";
      const success = await loginUser(data);
      if (success) {
        setSuccess(true);
        setError(false);
        setMessage("");
        navigate("/");
      } else {
        setSuccess(false);
        setError(true);
        setMessage(
          "Login failed due to invalid credentials, Please try to login or reset password"
        );
      }
    } catch (error) {
      console.error("error =>", error);
      setSuccess(false);
      setError(true);
      setMessage("Login failed due to server error, Please try again later");
    }
  };

  // TODO: Verify if this is working
  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/");
    }
    const registrationSuccess = localStorage.getItem("registrationSuccess");
    if (registrationSuccess === "true") {
      setToastType("success");
      setToastMessage("Registration Successful");
      setToastOpen(true);
      localStorage.removeItem("registrationSuccess");
    }
  }, [isUserLoggedIn, navigate]);

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
      <Grid container sx={styles.container}>
        <Grid item xs={12} md={6} sx={styles.formContainer}>
          {error && <div>{message}</div>}
          {!error && message && <div>{message}</div>}
          <Typography variant="h4" sx={styles.title}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" sx={styles.subtitle}>
            We are so happy to see you again
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={styles.form}
          >
            <InputField
              label="Email"
              name="email"
              register={register}
              required="Email is required"
              placeholder="Enter Username/Email ID"
              pattern={{
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              }}
              error={!!errors.email}
              errorMessage={errors.email?.message}
              testId={"user-email"}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              register={register}
              required="Password is required"
              placeholder="Enter Password"
              minLength={{
                value: 6,
                message: "Password must be at least 6 characters long",
              }}
              error={!!errors.password}
              errorMessage={errors.password?.message}
              testId={"confirm-pwd"}
            />
            <Typography variant="body2" sx={styles.forgotPasswordText}>
              <a href="/forgot-password">Forgot Password?</a>
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={styles.submitButton}
            >
              Sign In
            </Button>
            <Typography variant="body2" sx={styles.signInText}>
              Don't have an account?{" "}
              <a
                href="/content/sign-up"
                style={{ color: "#246EE9", textDecoration: "underline" }}
              >
                Sign Up
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignIn;
