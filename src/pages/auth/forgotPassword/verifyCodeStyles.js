const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#EAF4FF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formWrapper: {
    backgroundColor: "#FFFFFF",
    padding: "36px 28px",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
  },
  title: {
    fontWeight: 600,
    fontSize: "22px",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "16px",
  },
  successMessage: {
    fontSize: "14px",
    color: "#000",
    marginBottom: "12px",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  verifyButton: {
    backgroundColor: "#1890FF",
    textTransform: "none",
    fontWeight: 600,
    borderRadius: "6px",
    padding: "10px 0",
    fontSize: "14px",
  },
  resendLink: {
    marginTop: "8px",
    color: "#1890FF",
    fontSize: "13px",
    textAlign: "right",
    display: "inline-block",
  },
};

export default styles;
