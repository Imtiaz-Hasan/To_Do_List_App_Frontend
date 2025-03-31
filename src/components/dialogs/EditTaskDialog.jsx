"use client";

import { useState, useEffect, forwardRef } from "react";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditTaskDialog({ open, onClose, onSubmit, task }) {
  const [taskName, setTaskName] = useState("");
  const [taskError, setTaskError] = useState("");
  const [creationDate, setCreationDate] = useState(null);
  const [completionDate, setCompletionDate] = useState(null);
  const [creationDateError, setCreationDateError] = useState("");
  const [completionDateError, setCompletionDateError] = useState("");

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      const parsedCreationDate = task.creationDate ? new Date(task.creationDate) : null;
      const parsedCompletionDate = task.completionDate ? new Date(task.completionDate) : null;
      setCreationDate(parsedCreationDate);
      setCompletionDate(parsedCompletionDate);
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      setTaskError("Task name is required");
      return;
    } else {
      setTaskError("");
    }

    if (!creationDate) {
      setCreationDateError("Creation date is required");
      return;
    } else {
      setCreationDateError("");
    }

    if (!completionDate) {
      setCompletionDateError("Completion date is required");
      return;
    } else if (creationDate && completionDate < creationDate) {
      setCompletionDateError(
        "Completion date cannot be earlier than creation date"
      );
      return;
    } else {
      setCompletionDateError("");
    }

    try {
      await onSubmit(taskName, creationDate, completionDate);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showClass: {
          popup: 'swal2-noanimation',
          backdrop: 'swal2-noanimation'
        },
        hideClass: {
          popup: '',
          backdrop: ''
        }
      });
      Toast.fire({
        icon: "success",
        title: "Task updated successfully!"
      });
      handleClose();
    } catch (error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showClass: {
          popup: 'swal2-noanimation',
          backdrop: 'swal2-noanimation'
        },
        hideClass: {
          popup: '',
          backdrop: ''
        }
      });
      Toast.fire({
        icon: "error",
        title: error.message || "Failed to update task"
      });
    }
  };

  const handleClose = () => {
    setTaskName("");
    setCreationDate(null);
    setCompletionDate(null);
    setTaskError("");
    setCreationDateError("");
    setCompletionDateError("");
    onClose();
  };

  const DateInput = forwardRef(
    ({ label, value, onClick, error, helperText }, ref) => (
      <TextField
        fullWidth
        label={label}
        value={value || ""}
        onClick={onClick}
        inputRef={ref}
        error={!!error}
        helperText={helperText}
        InputProps={{
          readOnly: true,
        }}
      />
    )
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 pt-4">
          <div className="w-full">
            <TextField
              autoFocus
              label="Task Name"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              error={!!taskError}
              helperText={taskError}
            />
          </div>

          <div className="w-full">
            <DatePicker
              selected={creationDate}
              onChange={(date) => setCreationDate(date)}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-start"
              portalId="root-portal"
              withPortal
              customInput={
                <DateInput
                  label="Creation Date"
                  error={!!creationDateError}
                  helperText={creationDateError}
                />
              }
            />
          </div>

          <div className="w-full">
            <DatePicker
              selected={completionDate}
              onChange={(date) => setCompletionDate(date)}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-start"
              portalId="root-portal"
              withPortal
              customInput={
                <DateInput
                  label="Completion Date"
                  error={!!completionDateError}
                  helperText={completionDateError}
                />
              }
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
