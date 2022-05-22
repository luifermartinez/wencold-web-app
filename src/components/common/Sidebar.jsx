import { useContext } from "react"
import { AppContext } from "@/context/AppContext"
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { useTheme, styled } from "@mui/material/styles"
import CloseIcon from "@mui/icons-material/Close"
import WbSunnyIcon from "@mui/icons-material/WbSunny"
import ModeNightIcon from "@mui/icons-material/ModeNight"
import Logo from "./Logo"
import { Link as RouterLink, useLocation } from "react-router-dom"
import LoginIcon from "@mui/icons-material/Login"
import Copyright from "./Copyright"
import adminRoutes from "@/constants/adminRoutes"

const drawerWidth = 300

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

const role = {
  admin: "Administrador",
  customer: "Cliente",
  manager: "Encargado",
}

const routes = {
  admin: adminRoutes,
  customer: adminRoutes,
  manager: adminRoutes,
}

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { mode, setMode, user, token } = useContext(AppContext)
  const theme = useTheme()
  const { palette } = theme

  const { pathname } = useLocation()

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={isOpen}
    >
      <DrawerHeader>
        <IconButton onClick={() => setIsOpen(!isOpen)} c>
          <CloseIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </DrawerHeader>
      <Stack
        alignItems="center"
        direction="column"
        justifyContent="space-between"
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: theme.palette.background.paper,
          pt: 3,
          textAlign: "center",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 5, textAlign: "center" }}>
            <Logo size="h4" />
          </Box>
          {!token && (
            <RouterLink to="auth/sigin" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                startIcon={<LoginIcon />}
              >
                Iniciar sesión
              </Button>
            </RouterLink>
          )}
          {token && !user && <CircularProgress />}
          {user.email && (
            <Box
              sx={{
                p: 2,
                backgroundColor: palette.secondary.main,
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1" color="textPrimary">
                {`Bienvenido, ${user.people.firstname}`}
              </Typography>
              <Box
                sx={{
                  bgcolor: palette.background.paper,
                  borderRadius: 1,
                  mt: 1,
                  boxShadow: 3,
                }}
              >
                <Typography variant="subtitle1" color="textPrimary">
                  {`${role[user.role]}`}
                </Typography>
              </Box>
            </Box>
          )}
          {token && user.role && (
            <Stack spacing={1} direction="column" sx={{ mt: 2 }}>
              {routes[user.role]?.map(({ label, Icon, path }, index) => (
                <RouterLink
                  key={path}
                  to={path}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant={pathname === path ? "contained" : "outlined"}
                    fullWidth
                    size="small"
                    color="primary"
                    startIcon={<Icon />}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      marginLeft={1}
                      marginBottom={0}
                      variant="button"
                    >
                      {label}
                    </Typography>
                  </Button>
                </RouterLink>
              ))}
            </Stack>
          )}
        </Box>
        <Box
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="inherit"
            variant="outlined"
            fullWidth
            startIcon={mode === "dark" ? <WbSunnyIcon /> : <ModeNightIcon />}
            sx={{ mb: 3 }}
          >
            {mode === "dark" ? "Modo claro" : "Modo oscuro"}
          </Button>
          <Copyright />
        </Box>
      </Stack>
    </Drawer>
  )
}

export default Sidebar
