import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import NumberFormat from "react-number-format"
import { useForm } from "react-hook-form"
import { useContext, useEffect, useState } from "react"
import { LoadingButton } from "@mui/lab"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"

const ExchangeCreate = ({ isOpen, handleClose, mutate, exchange }) => {
  const { setMessage } = useContext(AppContext)
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      bsEquivalence: exchange ? exchange.bsEquivalence : null,
    },
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      reset({ bsEquivalence: null })
    }
  }, [isOpen])

  useEffect(() => {
    if (exchange) {
      setValue("bsEquivalence", exchange.bsEquivalence)
    }
  }, [exchange])

  const create = (values) => {
    setLoading(true)
    let url = "/exchange"

    if (exchange) {
      url = `/exchange/${exchange.id}`
    }

    fetcherAuth(url, values, exchange ? "PUT" : "POST")
      .then((data) => {
        setMessage({ type: "success", text: data.message })
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => {
        setLoading(false)
        handleClose()
        reset({ bsEquivalence: null })
        mutate()
      })
  }

  const useLast = () => {
    setLoading(true)
    fetcherAuth("/exchange", { useSameAsLast: true }, "POST")
      .then((data) => {
        setMessage({ type: "success", text: data.message })
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => {
        setLoading(false)
        handleClose()
        reset({ bsEquivalence: null })
        mutate()
      })
  }

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          marginTop: -10,
          border: "none",
          height: "100%",
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={11} md={7} lg={5}>
            <Card>
              <CardContent sx={{ position: "relative" }}>
                <Typography variant="h5" component="h2">
                  Registro de tasa de cambio
                </Typography>
                <IconButton
                  onClick={handleClose}
                  sx={{ position: "absolute", right: 10, top: 10 }}
                >
                  <CloseIcon />
                </IconButton>
                <Stack
                  spacing={2}
                  sx={{ mt: 2 }}
                  component="form"
                  noValidate
                  onSubmit={handleSubmit(create)}
                >
                  <Alert severity="warning" variant="outlined">
                    Sólo tienes una hora despues de la creación de una tasa de
                    cambio que es editable.
                  </Alert>
                  <NumberFormat
                    customInput={TextField}
                    label="Bolivares digitales por dólar"
                    fullWidth
                    suffix=" BsD = $ 1"
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    defaultValue={exchange ? exchange.bsEquivalence : null}
                    fixedDecimalScale
                    onValueChange={(values) => {
                      const { value } = values
                      setValue("bsEquivalence", value)
                    }}
                    color={errors.bsEquivalence ? "error" : "primary"}
                    helperText={
                      errors.bsEquivalence && errors.bsEquivalence.message
                    }
                    {...register("bsEquivalence", {
                      required: {
                        value: true,
                        message: "El campo es requerido",
                      },
                    })}
                  />
                  <LoadingButton
                    startIcon={<SaveIcon />}
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    loading={loading}
                  >
                    {exchange
                      ? "Guardar tasa de cambio"
                      : "Registrar tasa de cambio"}
                  </LoadingButton>
                </Stack>
                {!exchange && (
                  <LoadingButton
                    sx={{ mt: 2 }}
                    startIcon={<SaveIcon />}
                    fullWidth
                    variant="contained"
                    onClick={useLast}
                    disabled={loading}
                    loading={loading}
                  >
                    Usar la ultima tasa de cambio registrada
                  </LoadingButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ExchangeCreate
