import {
  Box,
  Card,
  Stack,
  IconButton,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Logo from "@/components/common/Logo"
import WbSunnyIcon from "@mui/icons-material/WbSunny"
import ModeNightIcon from "@mui/icons-material/ModeNight"
import { useContext, useState } from "react"
import { AppContext } from "@/context/AppContext"
import Page from "@/components/utils/Page"
import { useNavigate } from "react-router-dom"
import Copyright from "@/components/common/Copyright"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import { fetcher } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"

const SignUp = () => {
  const { mode, setMode, setMessage } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

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
      password: "",
      passwordConfirm: "",
      firstname: "",
      lastname: "",
      dni: "",
      phone: "",
      address: "",
      prefix: "V",
    },
  })

  const registerUser = (values) => {
    setLoading(true)
    const payload = {
      ...values,
      dni: `${values.prefix}-${values.dni}`,
    }
    fetcher("/auth/signup", payload, "POST")
      .then((data) => {
        setMessage({
          type: "success",
          text: data.message,
        })
        navigate("/auth/login")
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
    <Page title="InverWencold | Registro">
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
                Registro de usuario
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(registerUser)}
                sx={{ width: "100%" }}
              >
                <Stack spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="h6">Información de acceso</Typography>
                  <TextField
                    required
                    fullWidth
                    label="Correo electrónico"
                    helperText={errors.email && errors.email.message}
                    color={errors.email ? "error" : "primary"}
                    {...register("email", {
                      required: "El correo es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "El correo no es válido",
                      },
                    })}
                    autoFocus
                  />
                  <TextField
                    required
                    fullWidth
                    label="Contraseña"
                    type="password"
                    helperText={errors.password && errors.password.message}
                    color={errors.password ? "error" : "primary"}
                    {...register("password", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres",
                      },
                    })}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Confirmar contraseña"
                    type="password"
                    helperText={
                      errors.passwordConfirm && errors.passwordConfirm.message
                    }
                    color={errors.passwordConfirm ? "error" : "primary"}
                    {...register("passwordConfirm", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres",
                      },
                      validate: (value) =>
                        value === watch("password") ||
                        "Las contraseñas no coinciden",
                    })}
                  />
                  <Typography variant="h6">Información personal</Typography>
                  <Stack direction="row" spacing={1} alignItems="start">
                    <Select
                      size="small"
                      {...register("prefix")}
                      defaultValue={getValues("prefix")}
                    >
                      <MenuItem value="V">V</MenuItem>
                      <MenuItem value="J">J</MenuItem>
                      <MenuItem value="E">E</MenuItem>
                    </Select>
                    <NumberFormat
                      fullWidth
                      customInput={TextField}
                      size="small"
                      autoComplete="off"
                      required
                      thousandSeparator="."
                      decimalSeparator={false}
                      label="DNI o cédula de identidad"
                      color={errors.dni ? "error" : "primary"}
                      helperText={errors.dni && errors.dni.message}
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
                  <TextField
                    fullWidth
                    label="Nombre (s)"
                    required
                    {...register("firstname", {
                      required: "El nombre es requerido",
                      patten: {
                        value:
                          /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                        message: "El nombre no es válido",
                      },
                    })}
                    helperText={errors.firstname && errors.firstname.message}
                    color={errors.firstname ? "error" : "primary"}
                  />
                  <TextField
                    fullWidth
                    label="Apellido (s)"
                    required
                    {...register("lastname", {
                      required: "El apellido es requerido",
                      patten: {
                        value:
                          /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                        message: "El apellido no es válido",
                      },
                    })}
                    helperText={errors.lastname && errors.lastname.message}
                    color={errors.lastname ? "error" : "primary"}
                  />
                  <NumberFormat
                    fullWidth
                    customInput={TextField}
                    format="(###) ###-####"
                    label="Número de teléfono"
                    color={errors.phone ? "error" : "primary"}
                    helperText={errors.phone && errors.phone.message}
                    onValueChange={(values) => {
                      const { value } = values
                      setValue("phone", value)
                    }}
                    {...register("phone", {
                      minLength: {
                        value: 10,
                        message:
                          "El número de teléfono debe tener 10 carácteres",
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message:
                          "El número de teléfono solo puede contener números",
                      },
                    })}
                  />
                  <TextField
                    fullWidth
                    label="Dirección"
                    multiline
                    maxRows={Infinity}
                    {...register("address")}
                    helperText={errors.address && errors.address.message}
                    color={errors.address ? "error" : "primary"}
                  />
                  <LoadingButton
                    loading={loading}
                    disabled={loading}
                    type="submit"
                    fullWidth
                    variant="contained"
                  >
                    Registrarse
                  </LoadingButton>
                </Stack>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Page>
  )
}

export default SignUp
