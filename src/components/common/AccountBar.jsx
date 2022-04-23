import {
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Divider,
  Button,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useContext, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import LogoutIcon from "@mui/icons-material/Logout"
import { AppContext } from "@/context/AppContext"

const AccountBar = () => {
  const { mode } = useContext(AppContext)
  const { palette } = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Stack direction="row" alignItems="center" paddingRight={2}>
      {/* Avatar from random source */}
      <IconButton
        id="basic-button"
        color="inherit"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          p: 0,
          backgroundColor:
            mode === "dark"
              ? palette.secondary.dark
              : palette.background.default,
          border: mode === "light" ? 1 : 0,
		  borderColor: mode === "light" ? palette.text.disabled : palette.background.default,
        }}
      >
        <ArrowDropDownIcon sx={{ fontSize: 40 }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Paper
          sx={{
            width: 300,
            backgroundColor: "transparent",
            boxShadow: 0,
            backgroundImage: "none",
            p: 1,
          }}
        >
          <MenuItem onClick={handleClose}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src="https://picsum.photos/200/200"
                alt="Profile"
                sx={{ borderColor: palette.text.primary, border: 1, width: 56, height: 56 }}
              />
              <Typography variant="body1">Profile</Typography>
            </Stack>
          </MenuItem>
          <Divider />
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<LogoutIcon />}
            sx={{ textTransform: "none" }}
          >
            Cerrar sesión
          </Button>
        </Paper>
      </Menu>
    </Stack>
  )
}

export default AccountBar
