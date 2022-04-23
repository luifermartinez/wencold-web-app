import { Box, Container, Card, Stack, IconButton, Avatar } from "@mui/material"
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
import { GoogleLogin } from "react-google-login"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
import FacebookIcon from "@mui/icons-material/Facebook"
import LoginIcon from "@mui/icons-material/Login"
import googleLogo from "@/assets/img/google.svg"

const clientId =
  "749692310356-oatj2q6m8a67t5eg6ovutckrq3nif6cl.apps.googleusercontent.com"

const SignIn = () => {
  const { mode, setMode } = useContext(AppContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const responseGoogle = (response) => {
    if (response.googleId) {
      setEmail(response.profileObj.email)
    } else {
      setEmail("")
      setPassword("")
    }
  }

  const responseFacebook = (response) => {
    console.log(response)
  }

  return (
    <Page title="appart.dev | Iniciar sesión">
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
          <Logo size="h1" />
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
                <GoogleLogin
                  clientId={clientId}
                  render={(renderProps) => (
                    <Button
                      color="inherit"
                      startIcon={
                        <Avatar
                          src={googleLogo}
                          sx={{ width: 16, height: 16 }}
                        />
                      }
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      sx={{
                        backgroundColor: "#fafafa",
                        color: "#000",
                        "&:hover": {
                          backgroundColor: "#e9e9e9",
                        },
                      }}
                    >
                      Iniciar con Google
                    </Button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                />
                <FacebookLogin
                  appId="478931630358796"
                  autoLoad
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <Button
                      variant="contained"
                      startIcon={<FacebookIcon />}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      sx={{
                        backgroundColor: "#3b5998",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#526ca1",
                        },
                      }}
                    >
                      Iniciar con Facebook
                    </Button>
                  )}
                />
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
