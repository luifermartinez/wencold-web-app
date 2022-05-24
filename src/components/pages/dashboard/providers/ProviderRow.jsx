import {
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
} from "@mui/material"
import React, { useState } from "react"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import NumberFormat from "react-number-format"
import EditIcon from "@mui/icons-material/Edit"
import { useNavigate } from "react-router-dom"

const ProviderRow = React.memo(function UserRow({ provider, mutate }) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <TableRow>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{provider.people.dni}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {provider.people.firstname} {provider.people.lastname}
      </TableCell>
      <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
        <NumberFormat
          value={provider.people.phone}
          format="(###) ###-####"
          displayType="text"
        />
      </TableCell>
      <TableCell>{provider.people.address}</TableCell>
      <TableCell>
        <Chip
          variant="outlined"
          color={provider.deletedAt ? "error" : "primary"}
          label={provider.deletedAt ? "Inactivo" : "Activo"}
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
          <MenuItem
            onClick={() =>
              navigate("new", {
                state: {
                  id: provider.id,
                },
              })
            }
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
})

export default ProviderRow
