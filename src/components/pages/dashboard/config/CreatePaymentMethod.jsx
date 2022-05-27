import Page from "@/components/utils/Page"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import { useNavigate, useParams } from "react-router-dom"
import SaveIcon from "@mui/icons-material/Save"
import { useCallback, useContext, useEffect, useState } from "react"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"

const CreatePaymentMethod = () => {
  const { setMessage } = useContext(AppContext)
  const { id } = useParams()
  const navigate = useNavigate()

  const title = id ? "Editar método de pago" : "Nuevo método de pago"

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [active, setActive] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      ownerName: "",
      dni: "",
      prefix: "V",
      email: "",
      phoneNumber: "",
      bankName: "",
      accountNumber: "",
    },
  })

  const fetchPaymentMethod = useCallback(() => {
    if (id) {
      setLoading(true)
      fetcherAuth(`/payment-methods/${id}`)
        .then((res) => {
          const prefix = res.data.dni.substring(0, 1)
          const dni = res.data.dni.substring(2)
          setActive(!res.data.deletedAt)
          reset({ ...res.data, prefix, dni })
        })
        .catch((error) => {
          setMessage({ type: "error", text: error.message })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id])

  useEffect(() => {
    fetchPaymentMethod()
  }, [fetchPaymentMethod])

  const save = (values) => {
    setSubmitting(true)
    const payload = {
      ...values,
      dni: `${values.prefix}-${values.dni}`,
    }
    let url = `/payment-methods`
    let method = "POST"
    if (id) {
      url = `/payment-methods/${id}`
      method = "PUT"
    }
    fetcherAuth(url, payload, method)
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        navigate("/dashboard/config")
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const togglePM = () => {
    fetcherAuth(`/payment-methods/${id}/toggle`, {}, "PUT")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        navigate("/dashboard/config")
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
  }

  return (
    <Page title={`InverWencold | ${title}`}>
      <Card>
        <CardContent component="form" onSubmit={handleSubmit(save)}>
          {id && loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <CircularProgress />
              <Typography marginTop={2}>Cargando...</Typography>
            </Box>
          ) : (
            <>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h5" component="h2">
                    {title}
                  </Typography>
                  {id && (
                    <Button variant="contained" size="small" onClick={togglePM}>
                      {active ? "Desactivar" : "Activar"}
                    </Button>
                  )}
                </Stack>
                <Alert variant="outlined" severity="warning">
                  Llene los campos de ser necesarios para el método de pago.
                </Alert>
                <TextField
                  label="Nombre del método de pago *"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  color={errors.name ? "error" : "primary"}
                  helperText={errors.name && errors.name.message}
                  {...register("name", {
                    required: {
                      value: true,
                      message: "El nombre del método de pago es requerido",
                    },
                  })}
                />
                <TextField
                  label="Nombre del propietario"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  color={errors.ownerName ? "error" : "primary"}
                  helperText={errors.ownerName && errors.ownerName.message}
                  {...register("ownerName")}
                />
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
                    {...register("dni")}
                  />
                </Stack>
                <TextField
                  label="Correo electrónico"
                  fullWidth
                  type="email"
                  size="small"
                  autoComplete="off"
                  color={errors.email ? "error" : "primary"}
                  helperText={errors.email && errors.email.message}
                  {...register("email", {
                    patter: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "El correo electrónico no es válido",
                    },
                  })}
                />
                <NumberFormat
                  fullWidth
                  customInput={TextField}
                  size="small"
                  autoComplete="off"
                  format="(###) ###-####"
                  label="Número de teléfono"
                  color={errors.phoneNumber ? "error" : "primary"}
                  helperText={errors.phoneNumber && errors.phoneNumber.message}
                  onValueChange={(values) => {
                    const { value } = values
                    setValue("phoneNumber", value)
                  }}
                  value={watch("phoneNumber")}
                  {...register("phoneNumber", {
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
                <TextField
                  label="Nombre del banco"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  color={errors.bankName ? "error" : "primary"}
                  helperText={errors.bankName && errors.bankName.message}
                  {...register("bankName")}
                />
                <NumberFormat
                  fullWidth
                  customInput={TextField}
                  size="small"
                  autoComplete="off"
                  format="#### #### #### #### ####"
                  label="Número de cuenta"
                  color={errors.accountNumber ? "error" : "primary"}
                  helperText={
                    errors.accountNumber && errors.accountNumber.message
                  }
                  onValueChange={(values) => {
                    const { value } = values
                    setValue("accountNumber", value)
                  }}
                  value={watch("accountNumber")}
                  {...register("accountNumber", {
                    minLength: {
                      value: 20,
                      message: "El número de cuenta debe tener 20 carácteres",
                    },
                  })}
                />
                <LoadingButton
                  startIcon={<SaveIcon />}
                  type="submit"
                  variant="contained"
                  loading={submitting}
                  disabled={submitting}
                >
                  Guardar
                </LoadingButton>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </Page>
  )
}

export default CreatePaymentMethod
