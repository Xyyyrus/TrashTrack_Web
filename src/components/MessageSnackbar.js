import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';


const MessageSnackbar = ({ open, handleClose, message, severity }) => {
  return (
    <div className="messagesnackbar">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        color="primary"
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MessageSnackbar;
