import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import ROLE from "@/constants/roles"
import { AppContext } from "@/context/AppContext"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import { useLocation, useNavigate } from "react-router-dom"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { fetcherAuth } from "@/helpers/fetch"

const CreateUser = () => {
  const { state } = useLocation()
  const { setMessage } = useContext(AppContext)
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      dni: "",
      lastname: "",
      email: "",
      firstname: "",
      phone: "",
      address: "",
      prefix: "V",
    },
  })

  const create = (values) => {
    setSubmitting(true)
    const payload = {
      ...values,
      role: state.role,
      dni: `${values.prefix}-${values.dni}`,
    }
    fetcherAuth("/users/create", payload, "POST")
      .then((data) => {
        setMessage({
          type: "success",
          text: data.message,
        })
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
      .finally(() => {
        setSubmitting(false)
        navigate("/dashboard/users")
      })
  }

  useEffect(() => {
    if (state) {
      if (!state.role) {
        setMessage({ type: "error", text: "No se pudo crear el usuario" })
        navigate("/dashboard/users")
      }
    }
  }, [state])

  return (
    <Page title="InverWencold | Creacion de usuario">
      <Banner
        title={
          state?.role
            ? `Creación de ${ROLE[state.role]}`
            : "Creación de usuario"
        }
      />
      <Card>
        <Box component="form" onSubmit={handleSubmit(create)} noValidate>
          <CardContent>
            <Grid container justifyContent="center">
              <Grid item xs={12} paddingX={1} marginBottom={2}>
                <Typography variant="h6" fontWeight={700} marginBottom={0}>
                  Información del usuario
                </Typography>
              </Grid>
              <Grid container item xs={12} marginBottom={2}>
                <Grid item xs={12} md={6} paddingX={1}>
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
                      thousandSeparator="."
                      decimalSeparator={false}
                      label="DNI o cédula de identidad"
                      color={errors.dni ? "error" : "primary"}
                      helperText={errors.dni && errors.dni.message}
                      onValueChange={(values) => {
                        const { value } = values
                        setValue("dni", value)
                      }}
                      value={getValues("dni")}
                      {...register("dni", {
                        required: {
                          value: true,
                          message: "El campo es requerido",
                        },
                        minLength: {
                          value: 8,
                          message: "La cedula debe tener al menos 8 carácteres",
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "La cedula solo puede contener números",
                        },
                      })}
                    />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container item xs>
                <Grid item xs={12} md={6} paddingX={1} marginBottom={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Nombre (s)"
                    color={errors.firstname ? "error" : "primary"}
                    helperText={errors.firstname && errors.firstname.message}
                    {...register("firstname", {
                      required: {
                        value: true,
                        message: "El campo es requerido",
                      },
                      pattern: {
                        value:
                          /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                        message: "El nombre solo puede contener letras",
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6} paddingX={1} marginBottom={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Apellido (s)"
                    color={errors.lastname ? "error" : "primary"}
                    helperText={errors.lastname && errors.lastname.message}
                    {...register("lastname", {
                      required: {
                        value: true,
                        message: "El campo es requerido",
                      },
                      pattern: {
                        value:
                          /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                        message: "El apellido solo puede contener letras",
                      },
                    })}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} paddingX={1} marginBottom={2}>
                <NumberFormat
                  fullWidth
                  customInput={TextField}
                  size="small"
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
                      message: "El número de teléfono debe tener 10 carácteres",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message:
                        "El número de teléfono solo puede contener números",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} paddingX={1} marginBottom={2}>
                <TextField
                  label="Dirección"
                  fullWidth
                  size="small"
                  color={errors.address ? "error" : "primary"}
                  helperText={errors.address && errors.address.message}
                  {...register("address")}
                />
              </Grid>
              <Grid item xs={12} paddingX={1} marginBottom={2}>
                <Typography variant="h6" fontWeight={700} marginBottom={0}>
                  Información de ingreso
                </Typography>
              </Grid>
              <Grid item xs={12} paddingX={1}>
                <TextField
                  type="email"
                  label="Correo electrónico"
                  fullWidth
                  size="small"
                  color={errors.email ? "error" : "primary"}
                  helperText={errors.email && errors.email.message}
                  {...register("email", {
                    required: {
                      value: true,
                      message: "El campo es requerido",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "El correo electrónico no es válido",
                    },
                  })}
                />
              </Grid>
            </Grid>
            <Stack justifyContent="end" paddingX={1} marginTop={2}>
              <LoadingButton
                loading={submitting}
                variant="contained"
                size="small"
                type="submit"
                startIcon={<PersonAddIcon />}
              >
                Crear
              </LoadingButton>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </Page>
  )
}

export default CreateUser
