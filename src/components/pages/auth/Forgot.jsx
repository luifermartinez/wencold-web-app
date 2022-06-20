import { useContext, useState } from "react"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import {
  Alert,
  Box,
  Card,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import WbSunnyIcon from "@mui/icons-material/WbSunny"
import ModeNightIcon from "@mui/icons-material/ModeNight"
import Logo from "@/components/common/Logo"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import { fetcher } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"
import { useNavigate } from "react-router-dom"

const RecoverPassword = ({ email, dni }) => {
  const { setMessage } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  })

  const recover = (values) => {
    setLoading(true)
    fetcher(`/auth/change-password`, { ...values, email, dni }, "POST")
      .then(() => {
        setMessage({
          type: "success",
          text: "Has cambiado tu contraseña correctamente",
        })
        navigate("/auth/signin")
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit(recover)}>
      <Alert variant="outlined" severity="success">
        Identidad confirmada. Por favor, ingresa tu nueva contraseña.
      </Alert>
      <TextField
        fullWidth
        size="small"
        label="Nueva contraseña"
        helperText={errors.password && errors.password.message}
        color={errors.password ? "error" : "primary"}
        error={errors.password}
        type="password"
        {...register("password", {
          required: "La contraseña es requerida",
          minLength: {
            value: 8,
            message: "La contraseña debe tener al menos 8 caracteres",
          },
        })}
      />
      <TextField
        fullWidth
        size="small"
        label="Confirmar contraseña"
        helperText={errors.passwordConfirm && errors.passwordConfirm.message}
        color={errors.passwordConfirm ? "error" : "primary"}
        error={errors.passwordConfirm}
        type="password"
        {...register("passwordConfirm", {
          required: "La confirmación de contraseña es requerida",
          minLength: {
            value: 8,
            message:
              "La confirmación de contraseña debe tener al menos 8 caracteres",
          },
          validate: (value) =>
            value === watch("password") || "Las contraseñas no coinciden",
        })}
      />
      <LoadingButton
        loading={loading}
        type="submit"
        fullWidth
        variant="contained"
      >
        Cambiar contraseña
      </LoadingButton>
    </Stack>
  )
}

const Forgot = () => {
  const { setMode, mode, setMessage } = useContext(AppContext)
  const theme = useTheme()
  const [valid, setValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const xs = useMediaQuery(theme.breakpoints.between("xs", "md"))
  const md = useMediaQuery(theme.breakpoints.between("md", "lg"))
  const lg = useMediaQuery(theme.breakpoints.up("lg"))

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      dni: "",
      prefix: "V",
    },
  })

  const check = (values) => {
    setLoading(true)
    fetcher(
      `/auth/check?email=${values.email}&dni=${values.prefix}-${values.dni}`
    )
      .then(() => setValid(true))
      .catch((error) =>
        setMessage({
          type: "error",
          text: error.message,
        })
      )
      .finally(() => setLoading(false))
  }

  return (
    <Page title="InverWencold | Olvidé mi contraseña">
      <IconButton
        color="default"
        sx={{ position: "absolute", top: 15, right: 15 }}
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
      >
        {mode === "dark" ? <WbSunnyIcon /> : <ModeNightIcon />}
      </IconButton>
      <Grid container justifyContent="center">
        <Grid item xs={11} md={8} lg={6}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Logo size={xs ? "h4" : md ? "h3" : lg ? "h2" : "h2"} />
            <Card
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 5,
                width: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recuperar acceso
              </Typography>
              <Stack spacing={3} sx={{ width: "100%" }}>
                <Stack
                  spacing={2}
                  sx={{ width: "100%" }}
                  component="form"
                  onSubmit={handleSubmit(check)}
                >
                  <Alert variant="outlined" severity="info">
                    Antes de continuar, verifique que su correo electrónico y
                    DNI son correctos.
                  </Alert>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    autoComplete="off"
                    disabled={valid}
                    label="Correo electrónico"
                    helperText={errors.email && errors.email.message}
                    color={errors.email ? "error" : "primary"}
                    error={errors.email}
                    {...register("email", {
                      required: "El correo es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "El correo no es válido",
                      },
                    })}
                    autoFocus
                  />
                  <Stack direction="row" spacing={1} alignItems="start">
                    <Select
                      size="small"
                      {...register("prefix")}
                      defaultValue={getValues("prefix")}
                      disabled={valid}
                    >
                      <MenuItem value="V">V</MenuItem>
                      <MenuItem value="J">J</MenuItem>
                      <MenuItem value="E">E</MenuItem>
                    </Select>
                    <NumberFormat
                      fullWidth
                      customInput={TextField}
                      autoComplete="off"
                      required
                      size="small"
                      disabled={valid}
                      thousandSeparator="."
                      decimalSeparator={false}
                      label="DNI o cédula de identidad"
                      color={errors.dni ? "error" : "primary"}
                      helperText={errors.dni && errors.dni.message}
                      error={errors.dni}
                      onValueChange={(values) => {
                        const { value } = values
                        setValue("dni", value)
                      }}
                      value={watch("dni")}
                      {...register("dni", {
                        required: "El DNI es requerido",
                        minLength: {
                          value: 7,
                          message: "El DNI debe tener al menos 7 caracteres",
                        },
                      })}
                    />
                  </Stack>
                  <Collapse in={!valid}>
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      fullWidth
                      variant="contained"
                    >
                      Comprobar información
                    </LoadingButton>
                  </Collapse>
                </Stack>
                <Collapse in={valid}>
                  <RecoverPassword
                    email={watch("email")}
                    dni={`${watch("prefix")}-${watch("dni")}`}
                  />
                </Collapse>
              </Stack>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Page>
  )
}

export default Forgot
