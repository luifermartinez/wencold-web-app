import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { useContext, useEffect, useState } from "react"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"
import { useLocation, useNavigate } from "react-router-dom"
import SaveIcon from "@mui/icons-material/Save"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"

const CreateProvider = () => {
  const { state } = useLocation()
  const { setMessage } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      dni: "",
      phone: "",
      address: "",
      prefix: "V",
    },
  })
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (state) {
      if (state.id) {
        setLoading(true)
        fetcherAuth(`/provider/${state.id}`)
          .then(({ data }) => {
            reset({
              firstname: data.people.firstname,
              lastname: data.people.lastname,
              dni: data.people.dni.substring(2, data.people.dni.length - 1),
              phone: data.people.phone,
              address: data.people.address,
              prefix: data.people.dni.substring(0, 1),
            })
            setActive(data.deletedAt !== null)
          })
          .catch(() => {
            setMessage({
              type: "error",
              text: "Error al cargar los datos del proveedor",
            })
          })
          .finally(() => setLoading(false))
      }
    }
  }, [state])

  const [submitting, setSubmitting] = useState(false)

  const save = (values) => {
    setSubmitting(true)
    const payload = {
      ...values,
      dni: `${values.prefix}-${values.dni}`,
    }
    let url = `/provider`
    let method = "POST"
    if (state?.id) {
      url = `/provider/${state.id}`
      method = "PUT"
    }

    fetcherAuth(url, payload, method)
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
        navigate("/dashboard/providers")
      })
  }

  const toggleProvider = () => {
    setSubmitting(true)

    fetcherAuth(`/provider/toggle/${state.id}`, null, "PUT")
      .then((data) => {
        setMessage({
          type: "info",
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
        navigate("/dashboard/providers")
      })
  }

  return (
    <Page
      title={`InverWencold | ${
        state?.id ? "Actualización de proveedor" : "Creación de proveedor"
      } `}
    >
      <Banner
        title={
          state?.id ? "Actualización de proveedor" : "Creación de proveedor"
        }
      />
      <Card>
        <Box component="form" onSubmit={handleSubmit(save)} noValidate>
          <CardContent>
            {!loading ? (
              <>
                <Grid container justifyContent="center">
                  <Grid item xs={12} paddingX={1} marginBottom={2}>
                    <Stack direction={"row"} justifyContent="space-between">
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        marginBottom={0}
                      >
                        Información del proveedor
                      </Typography>
                      {state?.id && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={toggleProvider}
                          startIcon={active ? <CheckIcon /> : <CloseIcon />}
                        >
                          {!active ? "Desactivar" : "Activar"}
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                  {!state?.id && (
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
                            label="DNI, cédula de identidad o RIF"
                            color={errors.dni ? "error" : "primary"}
                            defaultValue={getValues("dni")}
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
                                message:
                                  "DNI, cédula de identidad o RIF debe tener al menos 8 carácteres",
                              },
                              pattern: {
                                value: /^[0-9]+$/,
                                message:
                                  "DNI, cédula de identidad o RIF solo puede contener números",
                              },
                            })}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  )}
                  <Grid container item xs>
                    <Grid item xs={12} md={6} paddingX={1} marginBottom={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Nombre (s)"
                        color={errors.firstname ? "error" : "primary"}
                        helperText={
                          errors.firstname && errors.firstname.message
                        }
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
                        InputLabelProps={{
                          shrink: getValues("firstname") !== "",
                        }}
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
                          pattern: {
                            value:
                              /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                            message: "El apellido solo puede contener letras",
                          },
                        })}
                        InputLabelProps={{
                          shrink: getValues("lastname") !== "",
                        }}
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
                      value={getValues("phone")}
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
                  </Grid>
                  <Grid item xs={12} paddingX={1} marginBottom={2}>
                    <TextField
                      label="Dirección"
                      fullWidth
                      size="small"
                      color={errors.address ? "error" : "primary"}
                      helperText={errors.address && errors.address.message}
                      {...register("address")}
                      InputLabelProps={{ shrink: getValues("address ") !== "" }}
                    />
                  </Grid>
                </Grid>
                <Stack justifyContent="end" paddingX={1}>
                  <LoadingButton
                    loading={submitting}
                    variant="contained"
                    size="small"
                    type="submit"
                    startIcon={state?.id ? <SaveIcon /> : <PersonAddIcon />}
                  >
                    {state?.id ? "Guardar" : "Crear"}
                  </LoadingButton>
                </Stack>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <CircularProgress size={24} />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Cargando...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Box>
      </Card>
    </Page>
  )
}

export default CreateProvider
