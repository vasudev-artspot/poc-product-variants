const styles = {
  page: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#EBEFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Lato', sans-serif",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    width: "480px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
  },
  title: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: "32px",
    lineHeight: "40px",
    color: "#000000",
    marginBottom: "8px",
  },
  subtitle: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    color: "#888888",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "'Lato', sans-serif",
    },
    "& .MuiInputBase-input": {
      fontFamily: "'Lato', sans-serif",
    },
  },
  submitButton: {
    backgroundColor: "#2196F3",
    textTransform: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    height: "48px",
    mt: 1,
    fontFamily: "'Lato', sans-serif",
  },
  errorMessage: {
    marginTop: "12px",
    color: "red",
    fontSize: "14px",
    fontFamily: "'Lato', sans-serif",
  },
};

export default styles;
