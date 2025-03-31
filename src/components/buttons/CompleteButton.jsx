"use client"; // if you're using the app router

import { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { IconChecks } from "@tabler/icons-react";
export default function CompleteButton({ onClick }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tooltip title="Mark as Completed" placement="top" arrow>
      <IconButton
        color="success"
        onClick={onClick}
        aria-label="Mark as Completed"
      >
        <IconChecks stroke={2} />
      </IconButton>
    </Tooltip>
  );
}
