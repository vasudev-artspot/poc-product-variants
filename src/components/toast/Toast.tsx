import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  open: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, open, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Snackbar open={open} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
