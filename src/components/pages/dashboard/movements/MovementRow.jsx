import {
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import moment from "moment"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useState } from "react"
import role from "@/constants/roles"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import DragHandleIcon from "@mui/icons-material/DragHandle"

const MovementRow = ({ movement }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <TableRow>
      <TableCell align="center">{movement.id}</TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={1} alignItems="center">
          {movement.quantity > 0 ? (
            <ArrowUpwardIcon color="primary" fontSize="small" />
          ) : movement.quantity === 0 ? (
            <DragHandleIcon color="info" fontSize="small" />
          ) : (
            <ArrowDownwardIcon color="warning" fontSize="small" />
          )}
          <Typography>{movement.quantity}</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={isOpen ? 1 : 0}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>{movement.description}</Typography>
            <IconButton size="small" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  setIsOpen(!isOpen)
                  handleClose()
                }}
              >
                {!isOpen ? "Ver detalles" : "Ocultar detalles"}
              </MenuItem>
            </Menu>
          </Stack>
          <Collapse in={isOpen}>
            <Stack spacing={1}>
              <Typography variant="body2" color="textSecondary">
                Movimiento realizado por
              </Typography>
              <Typography variant="body2" fontWeight="700">
                {movement.user.email} | {movement.user.people.firstname}{" "}
                {movement.user.people.lastname} | {role[movement.user.role]}
              </Typography>
            </Stack>
          </Collapse>
        </Stack>
      </TableCell>
      <TableCell align="center">
        {moment(movement.createdAt).format("DD/MM/YYYY HH:mm A")}
      </TableCell>
    </TableRow>
  )
}

export default MovementRow
