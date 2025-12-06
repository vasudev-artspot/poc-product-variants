const setNewPasswordStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    background: '#EBF5FF',
  },
  formContainer: {
    background: '#ffffff',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    marginBottom: '10px',
    fontWeight: 600,
    fontSize: '22px',
    textAlign: 'center',
    color: '#000000',
  },
  subtitle: {
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#7D7D7D',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  submitButton: {
    marginTop: '20px',
    width: '100%',
    padding: '10px',
    background: '#0F8BFF',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    color: '#FFFFFF',
    '&:hover': {
      background: '#0D74D1',
    },
  },
};

export default setNewPasswordStyles;
