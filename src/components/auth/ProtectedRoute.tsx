import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext, { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = () => {
  const auth = useAuth();
  const { isUserLoggedIn, refreshAccessToken, getUser } = auth;  

  useEffect(() => {
    const refresh = async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error(error);
        //logout();
      }
    };
    const user = getUser();
    if (user && user.accessToken) {
      const tokenExp = new Date(fetchExpfromJWT(user.accessToken) * 1000);
      const now = new Date();

      // Refresh token if it's about to expire
      if (tokenExp.getTime() - now.getTime() < 5 * 60 * 1000) {
        refresh();
      }
    }
  }, [getUser, refreshAccessToken]);

  const fetchExpfromJWT = (token: string): number => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const parsed_token = JSON.parse(jsonPayload);
    const expiry = parsed_token["exp"];
    var exp = parseInt(expiry);
    return exp;
  };

  return isUserLoggedIn() ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
