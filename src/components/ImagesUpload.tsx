// src/components/ImagesUpload.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import AddIcon from "@mui/icons-material/Add";
import { deleteFile, uploadFiles } from "../services/file/FileUpload";
import RedCancel from "../assets/Icons/redCancel.png";
import ShopImageOne from "../assets/images/ShopImageOne.png"
import PlusIcon from "../assets/images/Vector.svg";

const BUCKET_URL =
  "http://ec2-3-145-105-139.us-east-2.compute.amazonaws.com:4566/web-content-bucket/";

interface ImagesUploadProps {
  uploadedImages: any[];
  setUploadedImages: any;
  metadata?: { contentType: string; mediaSubType: string };
  singleUpload?: boolean;
  title?: string;
}

const ImagesUpload = ({
  uploadedImages,
  setUploadedImages,
  metadata = { contentType: "", mediaSubType: "" },
  singleUpload = false,
  title = "Images",
}: ImagesUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  // overwrite dialog state
  const [overwriteDialogOpen, setOverwriteDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const safeParse = (val: any) => {
    let out = val;
    try {
      if (typeof out === "string") out = JSON.parse(out);
      if (typeof out === "string") out = JSON.parse(out);
    } catch {
      // ignore
    }
    return out;
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    setSuccessMessage(null);

    try {
      const uploadResult = await uploadFiles(files, metadata);

      if (
        uploadResult?.code === 200 &&
        Array.isArray(uploadResult?.result) &&
        uploadResult.result.length > 0
      ) {
        const parsedResults = uploadResult.result.map((r: any) => {
          const parsed = safeParse(r);

          if (parsed && typeof parsed === "object" && "success" in parsed) {
            return {
              success: Boolean(parsed.success),
              fileName: parsed.fileName || parsed.storedFileName || parsed.key,
              guid: parsed.guid,
              originalFileName:
                parsed.originalFileName ||
                parsed.original ||
                parsed.fileNameOriginal ||
                parsed.file ||
                "unknown",
            };
          }

          if (parsed && typeof parsed === "object") {
            const original = Object.keys(parsed)[0];
            const data = (original && parsed[original]) || {};
            return {
              success: Boolean(data.success),
              fileName: data.fileName || data.storedFileName || data.key,
              guid: data.guid,
              originalFileName: original || "unknown",
            };
          }
          return {
            success: false,
            fileName: undefined,
            guid: undefined,
            originalFileName: "unknown",
          };
        });

        const successful = parsedResults.filter(
          (f: any) => f.success && f.fileName
        );
        const failed = parsedResults.filter(
          (f: any) => !f.success || !f.fileName
        );

        const successItems = successful.map((file: any) => ({
          key: `${file.fileName}-${Date.now()}`,
          originalFileName: file.originalFileName,
          fileName: file.fileName!,
          guid: file.guid,
          size: files.find((f) => f.name === file.originalFileName)?.size || 0,
          previewUrl: `${BUCKET_URL}${file.fileName}`,
        }));

        const filtered = uploadedImages.filter(
          (img: any) =>
            !successful.some((s: any) => s.originalFileName === img.originalFileName)
        );

        setUploadedImages([...filtered, ...successItems]);

        setUploadErrors((prev: any[]) =>
          prev
            .filter(
              (err) =>
                !successful.some(
                  (s: any) => s.originalFileName === err.name
                )
            )
            .concat(
              failed.map((f: any) => ({
                name: f.originalFileName,
                message: "Upload failed",
              }))
            )
        );

        if (successItems.length > 0) {
          setSuccessMessage("Image(s) uploaded successfully!");
        }
      } else {
        setUploadErrors(
          files.map((file) => ({
            name: file.name,
            message: "Upload failed",
          }))
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadErrors(
        files.map((file) => ({
          name: file.name,
          message: "Upload error",
        }))
      );
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (singleUpload && uploadedImages.length > 0) {
      setPendingFile(acceptedFiles[0]);
      setOverwriteDialogOpen(true);
    } else {
      handleUpload(acceptedFiles);
    }
  };

  const confirmOverwrite = async () => {
    if (uploadedImages.length > 0 && pendingFile) {
      try {
        await deleteFile(uploadedImages[0].fileName);
        setUploadedImages([]);
        setDeleteMessage("Previous file deleted.");
      } catch (err) {
        console.error("Error deleting file before upload:", err);
      }

      await handleUpload([pendingFile]);
      setPendingFile(null);
    }
    setOverwriteDialogOpen(false);
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      await deleteFile(fileName);
      const updated = uploadedImages.filter((img: any) => img.fileName !== fileName);
      setUploadedImages(updated);
      setDeleteMessage("File deleted successfully");
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    multiple: !singleUpload,
  });

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mt: 1,
        }}
      >
        <Box
          {...getRootProps()}
          sx={{
            width: 150,
            height: 150,
            borderRadius: 2,
            border: "1px solid #D1D1D1",
            backgroundColor: "#FAFAFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <CircularProgress size={24} />
          ) : (
            <img src={PlusIcon} alt="Upload" style={{ width: 32, height: 32, color: "#6D6D6D" }} />
          )}
        </Box>

        {/* Uploaded image cards */}
        {uploadedImages.map((img: any) => (
          <Box
            key={img.key}
            sx={{
              position: "relative",
              width: 140,
              height: 140,
              borderRadius: 2,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              "& .deleteIcon": {
                opacity: 0,
                transition: "opacity 0.2s ease-in-out",
              },
              "&:hover .deleteIcon": {
                opacity: 1,
              },
            }}
          >
            <img
              src={`https://images.famejosh.in/l/${img.guid}_1024.webp`}
              // src={ShopImageOne}
              alt={img.originalFileName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* delete icon on top-right (like Figma) */}
            <IconButton
              className="deleteIcon"
              size="small"
              onClick={() => handleDeleteFile(img.fileName)}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "transparent",
                padding: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <img
                src={RedCancel}
                alt="Remove"
                style={{ width: 16, height: 16 }}
              />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* helper text under row */}
      {/* <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption">
          Supported formats: jpg, jpeg, png
        </Typography>
        <Typography variant="caption">Minimum Size: 25 MB</Typography>
      </Box> */}

      {/* simple error text (if any uploads failed) */}
      {uploadErrors.length > 0 && (
        <Box mt={1}>
          {uploadErrors.map((err, index) => (
            <Typography
              key={err.name + index}
              variant="caption"
              color="error"
              display="block"
            >
              {err.name}: {err.message || "Upload failed"}
            </Typography>
          ))}
        </Box>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!deleteMessage}
        autoHideDuration={3000}
        onClose={() => setDeleteMessage(null)}
      >
        <Alert
          onClose={() => setDeleteMessage(null)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {deleteMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={overwriteDialogOpen}
        onClose={() => setOverwriteDialogOpen(false)}
      >
        <DialogTitle>Replace existing file?</DialogTitle>
        <DialogContent>
          <Typography>
            Uploading this file will delete the current one. Do you want to
            continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmOverwrite} color="primary">
            Yes, Replace
          </Button>
          <Button onClick={() => setOverwriteDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImagesUpload;
