import {
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
import { useForm } from "react-hook-form"
import { LoadingButton } from "@mui/lab"
import SaveIcon from "@mui/icons-material/Save"
import { useContext, useEffect, useState } from "react"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"

const CreateProductType = ({ isOpen, handleClose, selected, mutate }) => {
  const { setMessage } = useContext(AppContext)
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name,
        description: selected.description,
      })
    }
  }, [selected])

  const [submitting, setSubmitting] = useState(false)

  const save = (values) => {
    setSubmitting(true)
    let url = "/product/productTypes"
    let method = "POST"
    const payload = {
      name: values.name,
      description: values.description,
    }
    if (selected) {
      payload.id = selected.id
      method = "PUT"
      url = `/product/productTypes/${selected.id}`
    }
    fetcherAuth(url, payload, method)
      .then((data) => {
        setMessage({ type: "success", text: data.message })
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
      .finally(() => {
        setSubmitting(false)
        reset({
          name: "",
          description: "",
        })
        handleClose()
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
                  {!selected
                    ? "Registro de tipo de producto"
                    : "Editar tipo de producto"}
                </Typography>
                <IconButton
                  onClick={handleClose}
                  sx={{ position: "absolute", right: 10, top: 10 }}
                >
                  <CloseIcon />
                </IconButton>
                <Stack
                  spacing={2}
                  marginTop={2}
                  component="form"
                  onSubmit={handleSubmit(save)}
                >
                  <TextField
                    label="Nombre del tipo de producto"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "El nombre del tipo de producto es requerido",
                      },
                      minLength: {
                        value: 3,
                        message:
                          "El nombre del tipo de producto debe tener al menos 3 caracteres",
                      },
                    })}
                    autoComplete="off"
                    color={errors.name ? "error" : "primary"}
                    helperText={errors.name && errors.name.message}
                  />
                  <TextField
                    label="Descripción del tipo de producto"
                    {...register("description", {
                      required: {
                        value: true,
                        message:
                          "La descripción del tipo de producto es requerida",
                      },
                      minLength: {
                        value: 3,
                        message:
                          "La descripción del tipo de producto debe tener al menos 3 caracteres",
                      },
                    })}
                    autoComplete="off"
                    color={errors.description ? "error" : "primary"}
                    helperText={
                      errors.description && errors.description.message
                    }
                  />
                  <LoadingButton
                    variant="contained"
                    startIcon={<SaveIcon />}
                    type="submit"
                    loading={submitting}
                    fullWidth
                  >
                    <Typography variant="button">Guardar</Typography>
                  </LoadingButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default CreateProductType
