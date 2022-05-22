import { Box, Button, Card, IconButton, Stack } from "@mui/material"
import LoginIcon from "@mui/icons-material/Login"
import MenuIcon from "@mui/icons-material/Menu"
import Logo from "./Logo"
import { Link as RouterLink } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "@/context/AppContext"
import AccountBar from "./AccountBar"

const Navbar = ({ isOpen, setIsOpen }) => {
  const { token } = useContext(AppContext)

  return (
    <Card sx={{ mb: 5 }}>
      <Box sx={{ p: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            <MenuIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Logo size="h5" />
          <Stack direction="row" alignItems="center" spacing={2}>
            {!token ? (
              <RouterLink to="auth/sigin" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none" }}
                  startIcon={<LoginIcon />}
                >
                  Iniciar sesión
                </Button>
              </RouterLink>
            ) : (
              <AccountBar />
            )}
          </Stack>
        </Stack>
      </Box>
    </Card>
  )
}

export default Navbar
