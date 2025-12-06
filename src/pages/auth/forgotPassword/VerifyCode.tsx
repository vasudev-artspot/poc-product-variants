import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Box,
  Typography,
  Grid,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputField from "../../../components/common/inputs/InputField";
import {
  IForgotPasswordUserInfo,
  IVerifyOTPInfo,
} from "../../../services/auth/types";
import ForgotPasswordService from "../../../services/auth/ForgotPasswordService";
import styles from "./verifyCodeStyles";

const VerifyCode: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [counter, setCounter] = useState<number>(120); // 2 minutes
  const [resendVisible, setResendVisible] = useState<boolean>(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const forgotPasswordServiceInstance = new ForgotPasswordService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IVerifyOTPInfo>();

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotPasswordEmail");
    if (storedEmail) setEmail(storedEmail);
    startTimer();
    return () => clearInterval(timerRef.current!);
  }, []);

  useEffect(() => {
    if (attempts >= 3) {
      setIsLocked(true);
      setOpen(true);
      const lockTimer = setTimeout(() => {
        setAttempts(0);
        setIsLocked(false);
        setOpen(false);
      }, 30000); // 30 seconds lock
      return () => clearTimeout(lockTimer);
    }
  }, [attempts]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCounter(120); // Start with 2 minutes
    setResendVisible(false);
    setSuccessMessage("");

    timerRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timerRef.current!);
        setResendVisible(true);
        return 0;
      });
    }, 1000);
  };

  const handleResend = async () => {
    startTimer();
    setValue("otp", "");
    try {
      const email = localStorage.getItem("forgotPasswordEmail");
      if (email) {
        const data: IForgotPasswordUserInfo = { email };
        const result = await forgotPasswordServiceInstance.verifyEmail(data);
        if (result) {
          setSuccessMessage("Code has been re-sent to your email. Please check and verify.");
        } else {
          localStorage.removeItem("forgotPasswordEmail");
        }
      } else {
        localStorage.removeItem("forgotPasswordEmail");
        navigate("/forgot-password");
      }
    } catch (error: any) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const onSubmit: SubmitHandler<IVerifyOTPInfo> = async (data) => {
    if (isLocked) return;
    try {
      const email = localStorage.getItem("forgotPasswordEmail");
      if (email) {
        data.email = email;
        const result = await forgotPasswordServiceInstance.verifyOtp(data);
        if (result) {
          setError(false);
          setErrorMessage("");
          navigate("/set-new-password");
        } else {
          setAttempts((prev) => prev + 1);
          setError(true);
          setErrorMessage("Invalid code. Please try again.");
        }
      } else {
        navigate("/forgot-password");
      }
    } catch (error: any) {
      setAttempts((prev) => prev + 1);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={styles.page}>
      <Grid container sx={styles.formWrapper}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={styles.title}>
            Verification Code
          </Typography>

          <Typography variant="body2" sx={styles.subtitle}>
            A 6-digit Code has been sent to your registered e-mail id{" "}
            <strong>{email}</strong>. Please enter it in the below box. The Code will expire in{" "}
            <strong style={{ color: "#000" }}>
              {Math.floor(counter / 60)}:{String(counter % 60).padStart(2, "0")} Minutes
            </strong>.
          </Typography>

          {successMessage && (
            <Typography sx={styles.successMessage}>
              ✅ {successMessage}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={styles.form}>
            <InputField
              label="Code *"
              name="otp"
              register={register}
              required="Verification code is required"
              placeholder="Enter your 6-digit verification code"
              pattern={{
                value: /^\d{6}$/,
                message: "Invalid verification code",
              }}
              error={!!errors.otp || error}
              errorMessage={errors.otp?.message || errorMessage}
              testId="verification-code"
            />

            <Button
              type="submit"
              variant="contained"
              sx={styles.verifyButton}
              disabled={isLocked}
            >
              Verify
            </Button>

            {resendVisible && (
              <Link
                component="button"
                variant="body2"
                onClick={handleResend}
                sx={styles.resendLink}
              >
                Resend Code
              </Link>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Account Locked</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Too many failed attempts. Your account is temporarily locked. Please try again after 30 seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VerifyCode;
