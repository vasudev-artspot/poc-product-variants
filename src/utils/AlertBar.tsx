import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

interface AlertContextType {
  showAlert: (
    message: string,
    severity: "error" | "warning" | "info" | "success"
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<{
    message: string;
    severity: "error" | "warning" | "info" | "success";
  }>();
  const [open, setOpen] = useState(false);

  const showAlert = (
    message: string,
    severity: "error" | "warning" | "info" | "success"
  ) => {
    setAlert({ message, severity });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {alert && (
          <Alert onClose={handleClose} severity={alert.severity}>
            {alert.message}
          </Alert>
        )}
      </Snackbar>
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert context
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
