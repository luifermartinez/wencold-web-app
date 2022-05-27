import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth, fetcherAuthFormData } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import { Navigate, useParams, useNavigate } from "react-router-dom"
import moment from "moment"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const EditProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { shape, palette } = useTheme()
  const { setMessage } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [productTypes, setProductTypes] = useState([])
  const [providers, setProviders] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [imagesPreview, setImagesPreview] = useState([])
  const inputImage = useRef()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      code: "",
      name: "",
      price: "",
      productType: "",
      provider: "",
      warrantyUpTo: "",
    },
  })

  const fetchProduct = useCallback(() => {
    if (id) {
      setLoading(true)
      fetcherAuth(`/stock/${id}`)
        .then(({ data }) => {
          reset({
            code: data.code,
            name: data.name,
            price: data.price,
            productType: data.productType.id,
            provider: data.provider.id,
            warrantyUpTo: data.warrantyUpTo,
          })
          setImagesPreview(data.productImage)
        })
        .catch((err) => {
          setMessage({ type: "error", text: err.message })
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const fetchProductTypes = () =>
    fetcherAuth(`/product/productTypes?page=1&limit=100000`)
      .then((res) => {
        setProductTypes(res.data)
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })

  const fetchProviders = () =>
    fetcherAuth(`/provider?page=1&limit=100000`)
      .then((res) => {
        setProviders(res.data)
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })

  useEffect(() => {
    ;(async () => {
      await fetchProductTypes()
      await fetchProviders()
    })()
  }, [])

  const uploadImages = (image) => {
    const formData = new FormData()
    formData.append("image", image)
    fetcherAuthFormData(`/stock/${id}/image`, formData, "POST")
      .then((res) => {
        setMessage({
          type: "success",
          text: "Se ha subido la imagen correctamente.",
        })
        /* setImagesPreview((prev) => [...prev, URL.createObjectURL(images[i])]) */
        fetchProduct()
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
  }

  const onSubmit = (values) => {
    setSubmitting(true)

    const fd = new FormData()

    fd.append("code", values.code)
    fd.append("name", values.name)
    fd.append("price", values.price)
    fd.append("productType", values.productType)
    fd.append("provider", values.provider)
    fd.append("warrantyUpTo", values.warrantyUpTo)

    fetcherAuthFormData(`/stock/${id}`, fd, "PUT")
      .then((res) => {
        setMessage({ type: "success", text: res.message })
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
      .finally(() => {
        setSubmitting(false)
        navigate("/dashboard/stock")
      })
  }

  const addImage = (e) => {
    if (imagesPreview.length < 5) {
      const { files } = e.target
      uploadImages(files[0])
    } else {
      setMessage({
        type: "error",
        text: "Sólo puedes subir 5 imágenes como máximo.",
      })
    }
  }

  const removeImage = (id) => {
    fetcherAuth(`/stock/${id}/image`, null, "DELETE")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        fetchProduct()
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
  }

  return !id ? (
    <Navigate to="/" />
  ) : (
    <Page title="InverWencold | Edición de producto">
      <Banner
        title="Edición de producto"
        description="En esta sección podrás editar los detalles de un producto."
      />
      <Card>
        <CardContent>
          {!loading ? (
            <Stack
              spacing={2}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Typography variant="h6">Producto</Typography>
              <Grid container>
                <Grid item xs={12} md={6} paddingX={1} marginBottom={2}>
                  <TextField
                    fullWidth
                    label="Código del producto *"
                    autoComplete="off"
                    disabled
                    {...register("code", {
                      required: {
                        value: true,
                        message: "El código del producto es requerido",
                      },
                    })}
                    InputLabelProps={{ shrink: watch("code") }}
                  />
                </Grid>
                <Grid item xs={12} md={6} marginBottom={2} paddingX={1}>
                  <TextField
                    fullWidth
                    label="Nombre del producto *"
                    autoComplete="off"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "El nombre del producto es requerido",
                      },
                    })}
                    color={errors.name ? "error" : "primary"}
                    helperText={errors.name && errors.name.message}
                    InputLabelProps={{ shrink: watch("name") }}
                  />
                </Grid>
                <Grid item xs={12} md={6} marginBottom={2} paddingX={1}>
                  <NumberFormat
                    fullWidth
                    customInput={TextField}
                    label="Precio ($ USD) *"
                    autoComplete="off"
                    decimalScale={2}
                    value={watch("price")}
                    fixedDecimalScale
                    suffix=" $"
                    onValueChange={(e) => {
                      setValue("price", e.value)
                    }}
                    {...register("price", {
                      required: {
                        value: true,
                        message: "El precio del producto es requerido",
                      },
                    })}
                    InputLabelProps={{ shrink: watch("price") }}
                    helperText={errors.price && errors.price.message}
                    color={errors.price ? "error" : "primary"}
                  />
                </Grid>
                <Grid item xs={12} md={6} marginBottom={2} paddingX={1}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Fecha de vencimiento"
                    autoComplete="off"
                    value={moment(watch("warrantyUpTo"))
                      .add(12, "h")
                      .format("YYYY-MM-DD")}
                    InputLabelProps={{ shrink: true }}
                    helperText={
                      errors.warrantyUpTo && errors.warrantyUpTo.message
                    }
                    color={errors.warrantyUpTo ? "error" : "primary"}
                    {...register("warrantyUpTo")}
                  />
                </Grid>
                <Grid item xs={12} marginBottom={2} paddingX={1}>
                  <FormControl fullWidth>
                    <InputLabel id="select-product-type">
                      Tipo de producto *
                    </InputLabel>
                    <Select
                      labelId="select-product-type"
                      label="Tipo de producto *"
                      value={watch("productType")}
                      {...register("productType", {
                        required: {
                          value: true,
                          message: "El tipo de producto es requerido",
                        },
                      })}
                      error={errors.productType}
                    >
                      {productTypes.map((val) => {
                        return (
                          <MenuItem key={val.id} value={val.id}>
                            {val.name} | {val.description}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} marginBottom={2} paddingX={1}>
                  <FormControl fullWidth>
                    <InputLabel id="select-provider">Proveedor *</InputLabel>
                    <Select
                      labelId="select-provider"
                      label="Proveedor *"
                      value={watch("provider")}
                      {...register("provider", {
                        required: {
                          value: true,
                          message: "El proveedor es requerido",
                        },
                      })}
                    >
                      {providers.map((val) => {
                        return (
                          <MenuItem key={val.id} value={val.id}>
                            {val.people.dni} | {val.people.firstname}{" "}
                            {val.people.lastname}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} marginBottom={2} paddingX={1}>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    ref={inputImage}
                    style={{ display: "none" }}
                    onChange={addImage}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    size="small "
                    color="primary"
                    onClick={() => inputImage.current.click()}
                  >
                    Agregar imágen
                  </Button>
                </Grid>
                <Grid item xs={12} marginBottom={2} paddingX={1}>
                  <Stack direction="row" spacing={2} sx={{ overflowX: "auto" }}>
                    {imagesPreview.map((val, index) => (
                      <Box
                        key={index}
                        sx={{ borderRadius: 1, position: "relative" }}
                      >
                        <IconButton
                          sx={{ position: "absolute", right: 5, top: 5, backgroundColor: palette.background.paper, border:1, borderColor: palette.divider }}
                          onClick={() => removeImage(val.id)}
                          size="small"
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_API
                          }/image?imagePath=${val.image.path}`}
                          alt={`imagen ${index}`}
                          height={150}
                          width={150}
                          style={{
                            objectFit: "cover",
                            borderRadius: shape.borderRadius,
                            minWidth: 150,
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              <LoadingButton
                type="submit"
                disabled={
                  errors.code ||
                  errors.name ||
                  errors.price ||
                  errors.productType ||
                  errors.provider ||
                  submitting
                }
                variant="contained"
                loading={submitting}
              >
                Guardar
              </LoadingButton>
            </Stack>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                p: 3,
              }}
            >
              <CircularProgress />
              <Typography variant="body1" marginTop={2}>
                Cargando...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Page>
  )
}

export default EditProduct
