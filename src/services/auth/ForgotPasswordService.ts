import {
  FORGOT_PASSWORD_SET_NEW_PASSWORD,
  FORGOT_PASSWORD_VERIFY_EMAIL_ROUTE,
  FORGOT_PASSWORD_VERIFY_OTP_ROUTE,
} from "../constants";
import AxiosAuthClient from "./AuthAxiosClient";
import { IForgotPasswordUserInfo, IResetPasswordInfo, IVerifyOTPInfo } from "./types";
import qs from "qs";

var AUTH_TOKEN = "";

const axiosAuthClientInstance = AxiosAuthClient.getInstance();

// Set the AUTH token for any request
axiosAuthClientInstance.interceptors.request.use(function (config: any) {
  if (AUTH_TOKEN !== "") {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return config;
});

class ForgotPasswordService {
  async verifyEmail(userInfo: IForgotPasswordUserInfo): Promise<boolean | undefined> {
    try {
      const response = await axiosAuthClientInstance.post(
        FORGOT_PASSWORD_VERIFY_EMAIL_ROUTE,
        qs.stringify(userInfo), // Encode to x-www-form-urlencoded
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        if (response.data.email === userInfo.email && response.data.success === true) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(userInfo: IVerifyOTPInfo): Promise<boolean | undefined> {
    try {
      const response = await axiosAuthClientInstance.post(
        FORGOT_PASSWORD_VERIFY_OTP_ROUTE,
        userInfo
      );

      if (response.status == 200) {
        if (response.data?.email === userInfo.email && response.data?.success === true) {
          if (response.data?.access) {
            AUTH_TOKEN = response.data.access;
            return true;
          }
        }
      }
      //TODO : Error scenario for OTP validation , do stuff like increment attempts etc
      return false;
    } catch (error) {
      throw error;
    }
  }

  async setNewPassword(userInfo: IResetPasswordInfo): Promise<boolean | undefined> {
    try {
      const response = await axiosAuthClientInstance.post(
        FORGOT_PASSWORD_SET_NEW_PASSWORD,
        userInfo
      );
      if (response.status === 200) {
        if (response.data.email == userInfo.email && response.data.success == true) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

export default ForgotPasswordService;
