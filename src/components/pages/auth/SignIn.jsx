import {
  Box,
  Container,
  Card,
  Stack,
  IconButton,
  useMediaQuery,
  Alert,
  Collapse,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
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
import { useForm } from "react-hook-form"
import { fetcher } from "@/helpers/fetch"
import LoadingButton from "@mui/lab/LoadingButton"

const SignIn = () => {
  const { mode, setMode, setToken, setMessage } = useContext(AppContext)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up("md"))

  const size = !matches ? "h4" : matchesMdUp ? "h1" : "h2"

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  })

  const signin = (values) => {
    setLoading(true)
    fetcher(`/auth/signin`, { ...values }, "POST")
      .then(({ data }) => {
        setToken(data)
        setMessage({
          type: "success",
          text: "Has iniciado sesión correctamente",
        })
      })
      .catch((error) => {
        setError(error.message)
        setTimeout(() => {
          setError(null)
        }, 3000)
      })
      .finally(() => setLoading(false))
  }

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
            <Box component="form" onSubmit={handleSubmit(signin)} noValidate>
              <Stack spacing={2} sx={{ mb: 2 }}>
                <TextField
                  required
                  fullWidth
                  {...register("email", {
                    required: {
                      value: true,
                      message: "El correo electrónico es requerido.",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "El correo electrónico no es válido.",
                    },
                  })}
                  label="Correo electrónico"
                  autoComplete="email"
                  color={errors.email ? "error" : "primary"}
                  helperText={errors.email && errors.email.message}
                  autoFocus
                />
                <TextField
                  required
                  fullWidth
                  label="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  color={errors.email ? "error" : "primary"}
                  helperText={errors.password && errors.password.message}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "La contraseña es requerida.",
                    },
                    minLength: {
                      value: 8,
                      message:
                        "La contraseña debe tener al menos 8 caracteres.",
                    },
                  })}
                />
                <LoadingButton
                  loading={loading}
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<LoginIcon />}
                >
                  Inicia sesión
                </LoadingButton>
                <Collapse in={error}>
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                </Collapse>
              </Stack>
              <Grid container>
                <Grid item>
                  <Link
                    to="/auth/forgot"
                    component={RouterLink}
                    variant="body2"
                    color="text.secondary"
                  >
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
