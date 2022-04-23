import Logo from "@/components/common/Logo"
import {
  Box,
  Card,
  Container,
  Button,
  IconButton,
  Stack,
  Drawer,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useTheme, styled } from "@mui/material/styles"
import { Link as RouterLink, Outlet } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "@/context/AppContext"
import WbSunnyIcon from "@mui/icons-material/WbSunny"
import ModeNightIcon from "@mui/icons-material/ModeNight"
import LoginIcon from "@mui/icons-material/Login"
import CloseIcon from "@mui/icons-material/Close"
import Copyright from "@/components/common/Copyright"
import { motion } from "framer-motion"
import AccountBar from "@/components/common/AccountBar"

const drawerWidth = 300

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
)

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

const variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.61, 1, 0.88, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.15,
      ease: [0.61, 1, 0.88, 1],
    },
  },
}

const GeneralLayout = () => {
  const { mode, setMode } = useContext(AppContext)
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {}, [])

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      <Box sx={{ disxplay: "flex" }}>
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
              backgroundColor: theme.palette.background.paper,
              pt: 3,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Button
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                color="inherit"
                variant="outlined"
                fullWidth
                startIcon={
                  mode === "dark" ? <WbSunnyIcon /> : <ModeNightIcon />
                }
              >
                {mode === "dark" ? "Modo claro" : "Modo oscuro"}
              </Button>
            </Box>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 5, textAlign: "center" }}>
                <Logo size="h3" />
              </Box>
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
            </Box>
            <Copyright />
          </Stack>
        </Drawer>
        <Main
          open={isOpen}
          sx={{
            marginLeft: isOpen ? `${drawerWidth}px` : 0,
          }}
        >
          <Container maxWidth="lg" sx={{ pt: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                minHeight: "calc(100vh - 64px)",
              }}
            >
              <Box>
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
                        <RouterLink
                          to="auth/sigin"
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: "none" }}
                            startIcon={<LoginIcon />}
                          >
                            Iniciar sesión
                          </Button>
                        </RouterLink>
                        <AccountBar />
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
                <Outlet />
              </Box>
              <Copyright />
            </Box>
          </Container>
        </Main>
      </Box>
    </motion.div>
  )
}

export default GeneralLayout
