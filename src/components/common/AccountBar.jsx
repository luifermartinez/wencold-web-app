import {
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Divider,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useContext, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import LogoutIcon from "@mui/icons-material/Logout"
import { AppContext } from "@/context/AppContext"
import { LoadingButton } from "@mui/lab"
import { fetcherAuth } from "@/helpers/fetch"
import { useNavigate } from "react-router-dom"

const AccountBar = () => {
  const { mode, user, setMessage, setToken, setUser } = useContext(AppContext)
  const { palette } = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setLoading(true)
    fetcherAuth("/auth/signout", {}, "POST")
      .then(() => {
        setMessage({
          type: "success",
          text: "Has cerrado sesión correctamente",
        })
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message + " Pero aún así hemos cerrado tu sesión local.",
        })
      })
      .finally(() => {
        setLoading(false)
        setToken(null)
        setUser({
          createdAt: "",
          email: "",
          expiresToken: null,
          id: null,
          image: null,
          people: {
            address: "",
            dni: "",
            firstname: "",
            id: null,
            lastname: "",
            phone: "",
          },
          role: "",
          status: "",
          updatedAt: "",
        })
        navigate("/auth/signin")
      })
  }

  return (
    <Stack direction="row" alignItems="center" paddingRight={2}>
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
          borderColor:
            mode === "light"
              ? palette.text.disabled
              : palette.background.default,
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
                sx={{
                  borderColor: palette.text.primary,
                  border: 1,
                  width: 56,
                  height: 56,
                }}
              />
              <Typography variant="body1">
                {user.people.firstname} {user.people.lastname}
              </Typography>
            </Stack>
          </MenuItem>
          <Divider />
          <LoadingButton
            onClick={handleLogout}
            variant="outlined"
            loading={loading}
            color="inherit"
            fullWidth
            startIcon={<LogoutIcon />}
            sx={{ textTransform: "none" }}
          >
            Cerrar sesión
          </LoadingButton>
        </Paper>
      </Menu>
    </Stack>
  )
}

export default AccountBar
