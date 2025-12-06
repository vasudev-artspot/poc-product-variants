import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AuthService from "../services/auth/AuthService";
import User from "../services/auth/types";
import TokenService from "../services/auth/TokenService";
import { getCookie, removeCookie } from "../utils/utils";
import { CONSTANTS } from "../constant/constant";

export interface AuthContextType {
  loginUser: (userData: any) => Promise<boolean>;
  logoutUser: () => void;
  isUserLoggedIn: () => boolean;
  refreshAccessToken: () => void;
  getUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const authService = AuthService.getInstance();

  // On mount, read token from cookie and initialize auth state so it survives reload
  useEffect(() => {
    try {
      const token = getCookie(CONSTANTS.TOKEN);
      if (token) {
        const userFromToken = TokenService.fetchUserFromToken(token);
        setUser(userFromToken);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // ignore
    }
  }, []);

  //User provided credenitals are valid , user can now access the site

  const refreshAccessToken = async () => {
    try {
      const userWithNewToken = await authService.refreshToken(user);
      console.log("New token");
      console.log(userWithNewToken);
      if (userWithNewToken) {
        setUser(userWithNewToken);
      } else {
        // Could not fetch access token
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (user) {
          refreshAccessToken();
        }
      },
      5 * 60 * 1000
    ); // Refresh every 5 minute

    return () => clearInterval(interval);
  }, [user]);

  const loginUser = async (userData: any): Promise<boolean> => {
    try {
      const user = await authService.loginUser(userData);
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      //TODO V Imp - Undo this and make setIsAuthenticated(false)
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const fetchRefreshToken = () => {
    // Invoke the /token/refresh api to fetch another token
    // and set it as access token
  };

  //TODO : Future send a request to logout user and deactivate tokens
  const logoutUser = (): void => {
    setIsAuthenticated(false);
    setUser(null);
    removeCookie(CONSTANTS.TOKEN);
  };

  const isUserLoggedIn = (): boolean => {
    return isAuthenticated;
  };

  // const isTokenValid = (): boolean => {
  //   //TODO Check if the access token is not expired
  //   if (!isTokenExpired()) {
  //     return true;
  //   }

  //   // if access token has expired fetch another refresh token
  //   if (fetchAnotherToken()) return true;
  //   else return false;
  // };

  // const getAccessToken = (): string | undefined => {
  //   return user?.accessToken;
  // };

  const getUser = (): User | null => {
    return user ? user : null;
  };

  const authContextType: AuthContextType = {
    loginUser,
    logoutUser,
    isUserLoggedIn,
    refreshAccessToken,
    getUser,
  };

  return (
    <AuthContext.Provider value={authContextType}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
