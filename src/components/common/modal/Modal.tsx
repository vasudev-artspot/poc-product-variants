import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  DialogProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  closeIconColor?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
  closeIconColor = "inherit",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        style: {
          margin: "20px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          aria-label='close'
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon sx={{ color: closeIconColor }} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "24px",
          background: "#f9f9f9",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <Box>{children}</Box>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
