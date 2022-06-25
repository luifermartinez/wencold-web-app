import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth, fetcherAuthFormData } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox"
import ProductRow from "./ProductRow"
import { useNavigate } from "react-router-dom"
import { isIterable } from "@/components/utils/isIterable"

const Entry = () => {
  const navigate = useNavigate()
  const { setMessage } = useContext(AppContext)
  const [productTypes, setProductTypes] = useState([])
  const [providers, setProviders] = useState([])
  const [productInfo, setProductInfo] = useState({
    code: "",
    name: "",
    warrantyUpTo: "",
    price: null,
    provider: "",
    productType: "",
    quantity: "",
  })
  const [price, setPrice] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      code: "",
      products: null,
    },
  })

  const fetchProductTypes = () =>
    fetcherAuth(`/product/productTypes?page=1&limit=100000`)
      .then((res) => {
        setProductTypes(res.data)
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })

  const fetchProviders = () =>
    fetcherAuth(`/provider?page=1&limit=100000&status=active`)
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
    register("products", {
      required: {
        value: true,
        message: "Debes registrar al menos un producto.",
      },
    })
  }, [])

  const create = (values) => {
    setSubmitting(true)

    const fd = new FormData()
    for (const key in values) {
      if (isIterable(values[key])) {
        fd.append(key, JSON.stringify(values[key]))
      } else {
        fd.append(key, values[key])
      }
    }

    fetcherAuthFormData(`/entry`, fd, "POST")
      .then((data) => {
        setMessage({ type: "success", text: data.message })
        navigate("/dashboard/stock")
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  useEffect(() => {
    setProductInfo((prev) => ({
      ...prev,
      price,
    }))
  }, [price])

  return (
    <Page title="InverWencold | Ingreso de productos">
      <Banner title="Ingreso de productos" />
      <Card>
        <Box component="form" onSubmit={handleSubmit(create)} noValidate>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} marginBottom={0}>
                Información de la entrada de productos
              </Typography>
              <TextField
                label="Código de la nota/factura de entrega"
                color={errors.code ? "error" : "primary"}
                helperText={errors.code && errors.code.message}
                autoComplete="off"
                value={watch("code").toUpperCase()}
                onChange={(e) => setValue("code", e.target.value.toUpperCase())}
                {...register("code", {
                  required: {
                    value: true,
                    message: "El código de la factura es requerido",
                  },
                })}
              />
              <Typography variant="h6" fontWeight={700} marginBottom={0}>
                Información de productos
              </Typography>
              <Grid container>
                <Grid item xs={12} md={6} paddingX={1} marginBottom={2}>
                  <TextField
                    fullWidth
                    label="Código del producto *"
                    autoComplete="off"
                    value={productInfo.code.toUpperCase()}
                    onChange={(e) =>
                      setProductInfo((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6} marginBottom={2} paddingX={1}>
                  <TextField
                    fullWidth
                    label="Nombre del producto *"
                    autoComplete="off"
                    value={productInfo.name}
                    onChange={(e) =>
                      setProductInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6} marginBottom={2} paddingX={1}>
                  <NumberFormat
                    fullWidth
                    customInput={TextField}
                    label="Precio ($ USD) *"
                    autoComplete="off"
                    decimalScale={2}
                    value={price}
                    fixedDecimalScale
                    suffix=" $"
                    onValueChange={(e) => {
                      setPrice(e.value)
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} marginBottom={2} paddingX={1}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Fecha de vencimiento"
                    autoComplete="off"
                    value={productInfo.warrantyUpTo}
                    onChange={(e) => {
                      if (
                        e.target.value < new Date().toISOString().split("T")[0]
                      ) {
                        setMessage({
                          type: "error",
                          text: "La fecha ingresada no puede ser antes del día actual, asegúrese de ingresar una fecha válida.",
                        })
                        return
                      }
                      setProductInfo((prev) => ({
                        ...prev,
                        warrantyUpTo: e.target.value,
                      }))
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} marginBottom={2} paddingX={1}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cantidad *"
                    autoComplete="off"
                    value={productInfo.quantity}
                    onChange={(e) =>
                      setProductInfo((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} marginBottom={2} paddingX={1}>
                  <FormControl fullWidth>
                    <InputLabel id="select-product-type">
                      Tipo de producto *
                    </InputLabel>
                    <Select
                      labelId="select-product-type"
                      value={productInfo.productType}
                      label="Tipo de producto *"
                      onChange={(e) =>
                        setProductInfo((prev) => ({
                          ...prev,
                          productType: e.target.value,
                        }))
                      }
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
                      value={productInfo.provider}
                      label="Proveedor *"
                      onChange={(e) =>
                        setProductInfo((prev) => ({
                          ...prev,
                          provider: e.target.value,
                        }))
                      }
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
                <Collapse in={errors.products} sx={{ width: "100%" }}>
                  <Alert
                    variant="outlined"
                    severity="error"
                    sx={{ mb: 2, mx: 1 }}
                  >
                    {errors.products?.message}
                  </Alert>
                </Collapse>
                <Button
                  sx={{ mx: 1 }}
                  fullWidth
                  variant="outlined"
                  startIcon={<MoveToInboxIcon />}
                  onClick={() => {
                    if (
                      productInfo.name ||
                      productInfo.price ||
                      productInfo.code ||
                      productInfo.quantity
                    ) {
                      const exist = watch("products")?.find(
                        (product) => product.code === productInfo.code
                      )

                      if (exist)
                        return setMessage({
                          type: "error",
                          message: "Ese producto ya existe",
                        })

                      const arr = getValues("products") || []
                      setValue("products", [
                        ...arr,
                        {
                          ...productInfo,
                          provider: providers.find(
                            (val) => val.id === productInfo.provider
                          ),
                          productType: productTypes.find(
                            (val) => val.id === productInfo.productType
                          ),
                        },
                      ])
                      setProductInfo({
                        name: "",
                        price: "",
                        code: "",
                        warrantyUpTo: "",
                        quantity: "",
                        productType: null,
                        provider: null,
                      })
                      setPrice("")
                    }
                  }}
                  size="medium"
                >
                  Agregar producto
                </Button>
                {watch("products")?.map((product, index) => (
                  <ProductRow
                    key={index}
                    product={product}
                    setValue={setValue}
                    getValues={getValues}
                  />
                ))}
              </Grid>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={submitting}
                disablde={submitting}
              >
                Realizar ingreso
              </LoadingButton>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </Page>
  )
}

export default Entry
