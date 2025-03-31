import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function ConfirmDialog({
  title = "Are you sure?",
  description = "You will not be able to revert this!",
  confirmButtonTitle = "Yes, delete it",
  cancelButtonTitle = "Cancel",
  response,
  children,
}) {
  const [open, setOpen] = useState(false);

  const showDialog = () => {
    setOpen(true);
  };

  const hideDialog = () => {
    setOpen(false);
  };

  const confirmRequest = () => {
    response();
    hideDialog();
  };

  return (
    <>
      {children(showDialog)}
      <Dialog
        open={open}
        onClose={hideDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideDialog} color="error" variant="contained">
            {cancelButtonTitle}
          </Button>
          <Button onClick={confirmRequest} color="success" variant="contained">
            {confirmButtonTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
