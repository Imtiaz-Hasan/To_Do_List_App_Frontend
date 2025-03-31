import { IconButton, Tooltip } from '@mui/material'
import { IconEdit } from '@tabler/icons-react';
export default function EditButton({ title = 'Edit', onClick }) {
  return (
    <Tooltip title={title} placement='top' arrow>
      <IconButton onClick={onClick} color='info'>
        <IconEdit stroke={2} />
      </IconButton>
    </Tooltip>
  )
}
