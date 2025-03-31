import { Button, IconButton, Tooltip } from "@mui/material";
import { IconTrash } from "@tabler/icons-react";
import ConfirmDialog from "../dialogs/ConfirmDialog";

export default function DeleteButton({
  title = "Delete",
  onClick,
  isIcon = true,
}) {
  return (
    <ConfirmDialog response={onClick}>
      {(showDialog) => (
        <Tooltip title={title} placement="top" arrow>
          {isIcon ? (
            <IconButton onClick={showDialog} color="error">
              <IconTrash stroke={2} />
            </IconButton>
          ) : (
            <Button color="error" onClick={showDialog}>
              Delete
            </Button>
          )}
        </Tooltip>
      )}
    </ConfirmDialog>
  );
}
