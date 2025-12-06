const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "1280px",
    margin: "0 auto",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    p: 3,
  },
  form: {
    mt: 2,
    display: "flex",
    flexDirection: "column",
    maxWidth: "450px",
    width: "100%",
    "& legend": {
      visibility: "visible",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        width: "100%",
        height: "2px",
        background: "#ffffff",
        top: "4px",
      },
    },
  },
  input: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "2px solid rgba(0, 0, 0, 0.5)",
    },
  },
  submitButton: {
    mt: 2,
    borderRadius: "50px",
    textTransform: 'none',
  },
  signInText: {
    mt: 2,
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    textAlign: "center", // Center text horizontally
  },
  subtitle: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center", // Center text horizontally
  }
};

export default styles;
