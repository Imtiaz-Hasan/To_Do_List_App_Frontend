import { Button, Tooltip } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";

export default function CreateButton({ title, onClick }) {
  return (
    <Tooltip title={title} placement="left" arrow>
      <Button
        variant="contained"
        startIcon={<IconPlus stroke={2} style={{ marginRight: -12 }} />}
        onClick={onClick}
        className="max-sm:is-full"
        style={{
          width: "32px",
          height: "32px",
          minWidth: "0",
          padding: "0",
          borderRadius: "4px",
        }}
      ></Button>
    </Tooltip>
  );
}
