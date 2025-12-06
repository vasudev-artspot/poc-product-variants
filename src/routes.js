import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Products from "./pages/Products";
import SignUp from "./pages/auth/signUp/SignUp";
import SignIn from "./pages/auth/signIn/SignIn";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";
import VerifyCode from "./pages/auth/forgotPassword/VerifyCode";
import SetNewPassword from "./pages/auth/forgotPassword/SetNewPassword";
import Congratulations from "./pages/auth/forgotPassword/Congratulations";
import Layout from "./template/layout/Layout";
import Outer from "./template/outer/Outer";

const routes = [
  
  { path: "/", element: <Products />, isProtected: true },
  { path: "/sign-up", element: <SignUp />, isProtected: false },
  { path: "/sign-in", element: <SignIn />, isProtected: false },
  { path: "/forgot-password", element: <ForgotPassword />, isProtected: false },
  { path: "/verify-code", element: <VerifyCode />, isProtected: false },
  {
    path: "/set-new-password",
    element: <SetNewPassword />,
    isProtected: false,
  },
  {
    path: "/congratulations",
    element: <Congratulations />,
    isProtected: false,
  },
];

const Routing = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/" />} />
    {routes.map((route) =>
      route.isProtected ? (
        <Route key={route.path} path={route.path} element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={route.element} />
          </Route>
        </Route>
      ) : (
        <Route key={route.path} path={route.path} element={<Outer />}>
          <Route index element={route.element} />
        </Route>
      )
    )}
  </Routes>
);

export default Routing;
