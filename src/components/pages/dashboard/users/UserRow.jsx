import role from "@/constants/roles"
import userStatuses from "@/constants/userStatuses"
import {
  Chip,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material"
import React, { useContext, useState } from "react"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DeleteIcon from "@mui/icons-material/Delete"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"
import { LoadingButton } from "@mui/lab"

const UserRow = React.memo(function UserRow({ user, mutate }) {
  const { setMessage } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [loading, setLoading] = useState(false)
  const [bannedReason, setBannedReason] = useState("")
  const [isOpenReason, setIsOpenReason] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const bannUser = () => {
    setLoading(true)
    fetcherAuth(`/users/${user.id}`, { status: "banned", bannedReason }, "PUT")
      .then((data) => {
        setMessage({ type: "success", text: data.message })
        mutate()
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
      .finally(() => {
        setAnchorEl(null)
        setBannedReason("")
        setLoading(false)
      })
  }

  const unBannUser = () => {
    setLoading(true)
    fetcherAuth(`/users/${user.id}`, { status: "active" }, "PUT")
      .then((data) => {
        setMessage({ type: "success", text: data.message })
        mutate()
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
      .finally(() => {
        setAnchorEl(null)
        setBannedReason("")
        setLoading(false)
      })
  }

  return (
    <TableRow key={user.id}>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{user.people.dni}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {user.people.firstname} {user.people.lastname}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell align="center">{role[user.role]}</TableCell>
      <TableCell align="center">
        <Chip
          variant="outlined"
          color={user.status === "active" ? "success" : "error"}
          label={userStatuses[user.status]}
          sx={{ borderRadius: 1 }}
        />
      </TableCell>
      <TableCell align="center">
        <IconButton
          id="seeMore"
          aria-controls={open ? "menu-users" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="menu-users"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "seeMore",
          }}
        >
          {user.status === "active" ? (
            <MenuItem onClick={() => setIsOpenReason(true)}>
              <Stack>
                <Stack direction="row" marginBottom={isOpenReason ? 2 : 0}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText>Banear</ListItemText>
                </Stack>
                <Collapse in={isOpenReason} sx={{ display: "block" }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Razón del ban"
                      variant="outlined"
                      value={bannedReason}
                      onChange={(e) => setBannedReason(e.target.value)}
                    />
                    <LoadingButton
                      loading={loading}
                      onClick={bannUser}
                      variant="contained"
                      color="secondary"
                    >
                      Banear
                    </LoadingButton>
                  </Stack>
                </Collapse>
              </Stack>
            </MenuItem>
          ) : (
            <MenuItem onClick={unBannUser}>
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText>Activar</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </TableCell>
    </TableRow>
  )
})

export default UserRow
