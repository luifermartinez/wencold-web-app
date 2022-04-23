import {
  Box,
  Container,
  Card,
  Stack,
  IconButton,
  useMediaQuery,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Logo from "@/components/common/Logo"
import WbSunnyIcon from "@mui/icons-material/WbSunny"
import ModeNightIcon from "@mui/icons-material/ModeNight"
import { useContext, useState } from "react"
import { AppContext } from "@/context/AppContext"
import Page from "@/components/utils/Page"
import { Link as RouterLink } from "react-router-dom"
import Copyright from "@/components/common/Copyright"
import LoginIcon from "@mui/icons-material/Login"

const SignIn = () => {
  const { mode, setMode } = useContext(AppContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up("md"))

  const size = !matches ? "h4" : matchesMdUp ? "h1" : "h2"

  return (
    <Page title="InverWencold | Iniciar sesión">
      <Container component="main" maxWidth="xs">
        <IconButton
          color="default"
          sx={{ position: "absolute", top: 15, right: 15 }}
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "dark" ? <WbSunnyIcon /> : <ModeNightIcon />}
        </IconButton>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Logo size={size} />
          <Card
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 5,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Iniciar sesión
            </Typography>
            <Box component="form" noValidate>
              <Stack spacing={2} sx={{ mb: 2 }}>
                <TextField
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Correo electrónico"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  label="Contraseña"
                  type="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<LoginIcon />}
                >
                  Inicia sesión
                </Button>
              </Stack>
              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2" color="text.secondary">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    variant="body2"
                    component={RouterLink}
                    to="/auth/signup"
                    color="text.secondary"
                  >
                    ¿No tienes una cuenta? Registrate
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </Page>
  )
}

export default SignIn
