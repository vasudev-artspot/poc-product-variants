import TokenService from "./TokenService";
import User, { RefreshToken } from "./types";
import { LOGIN_ROUTE, REFRESH_ROUTE } from "../constants";
import AxiosAuthClient from "./AuthAxiosClient";
import { setCookie } from "../../utils/utils";
import { CONSTANTS } from "../../constant/constant";
import { getCookie } from "../../utils/utils";

var AUTH_TOKEN = getCookie(CONSTANTS.TOKEN) || "";

const axiosAuthClientInstance = AxiosAuthClient.getInstance();

// Set the AUTH token for any request
axiosAuthClientInstance.interceptors.request.use(function (config: any) {
  if (AUTH_TOKEN !== "") {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return config;
});

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  // The function below invokes the login api on backend to validate user credentials
  // and fetch the access token
  async loginUser(userData: any): Promise<User | undefined> {
    try {
      const response = await axiosAuthClientInstance.post(
        LOGIN_ROUTE,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const accessToken = response?.data?.access;

      if (accessToken) {
        AUTH_TOKEN = accessToken;
        const user = TokenService.fetchUserFromToken(accessToken);

        setCookie(CONSTANTS.TOKEN, accessToken);

        //TODO - future this needs to be in cookie and not as service response and
        // thus need to be handled differently , and read from cookie set
        user.refreshToken = response?.data?.refresh;
        return user;
      } else {
        //User unauthrorized
        return undefined;
      }
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(user: User | null): Promise<User | undefined> {
    const refresh = new RefreshToken(user?.refreshToken);

    try {
      //TODO : figure out how to add access token to axiosLoginClient and also how to pass refresh token
      const response = await axiosAuthClientInstance.post(
        REFRESH_ROUTE,
        refresh,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const accessToken = response?.data?.access;
      if (accessToken) {
        const user = TokenService.fetchUserFromToken(accessToken);
        // persist new access token and update AUTH_TOKEN used by axios interceptor
        AUTH_TOKEN = accessToken;
        setCookie(CONSTANTS.TOKEN, accessToken);
        // TODO - future this needs to be in cookie and not as service response and
        // thus need to be handled differently , and read from cookie set
        user.refreshToken = response?.data?.refresh;
        return user;
      } else {
        //User unauthrorized
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }
}

export default AuthService;
