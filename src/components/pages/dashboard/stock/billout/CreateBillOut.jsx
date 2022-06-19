import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import ProductBillOutRow from "./ProductBillOutRow"
import SearchIcon from "@mui/icons-material/Search"
import NumberFormat from "react-number-format"
import { useForm } from "react-hook-form"
import DeleteIcon from "@mui/icons-material/Delete"
import { useNavigate } from "react-router-dom"

const CreateBillOut = () => {
  const navigate = useNavigate()
  const { setMessage } = useContext(AppContext)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [products, setProducts] = useState([])
  const [pageProducts, setPageProducts] = useState(1)
  const [limitProducts, setLimitProducts] = useState(5)
  const [provSearchProducts, setProvSearchProducts] = useState("")
  const [totalProducts, setTotalProducts] = useState(0)
  const [searchProducts, setSearchProducts] = useState("")
  const [lastExchange, setLastExchange] = useState(null)
  const [allLoadedProducts, setAllLoadedProducts] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [tax, setTax] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)

  const [selectedProducts, setSelectedProducts] = useState([])

  const handleAddProduct = (product, quantity) => {
    setSelectedProducts([...selectedProducts, { product, quantity }])
  }

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      dni: "",
      lastname: "",
      firstname: "",
      phone: "",
      address: "",
      prefix: "V",
    },
  })

  const fetchTax = useCallback(() => {
    fetcherAuth("/tax")
      .then((res) => {
        setTax(res.data)
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
  }, [])

  useEffect(() => {
    fetchTax()
  }, [fetchTax])

  const fetchProducts = useCallback(() => {
    setLoadingProducts(true)
    fetcherAuth(
      `/product?page=${pageProducts}&limit=${limitProducts}${
        searchProducts ? `&search=${searchProducts}` : ""
      }`
    )
      .then((res) => {
        const newProducts = res.data.filter(
          (product) => !allLoadedProducts.find((p) => p.id === product.id)
        )
        setAllLoadedProducts([...allLoadedProducts, ...newProducts])
        setProducts(res.data)
        setTotalProducts(res.total)
      })
      .catch((error) => {
        setMessage({
          type: "error",
          message: error.message,
        })
      })
      .finally(() => {
        setLoadingProducts(false)
      })
  }, [pageProducts, limitProducts, searchProducts])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (!provSearchProducts) setSearchProducts("")
  }, [provSearchProducts])

  const handleChangePage = (event, value) => {
    setPageProducts(value + 1)
  }

  const handleChangeRowsPerPage = (event) => {
    setLimitProducts(parseInt(event.target.value, 10))
    setPageProducts(1)
  }

  const fetchLastExchange = useCallback(() => {
    fetcherAuth(`/exchange/last`)
      .then((res) => {
        setLastExchange(res.data.bsEquivalence)
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
  }, [])

  useEffect(() => {
    fetchLastExchange()
  }, [fetchLastExchange])

  const create = (values) => {
    if (selectedProducts.find((p) => p.quantity < 1)) {
      setMessage({
        type: "error",
        text: "La cantidad debe ser mayor a 0",
      })
      return
    }
    if (selectedProducts.find((p) => p.quantity > p.product.available)) {
      setMessage({
        type: "error",
        text: "La cantidad debe ser menor a la disponible",
      })
      return
    }
    const payload = {
      ...values,
      dni: `${values.prefix}-${values.dni}`,
    }
    setSubmitting(true)
    fetcherAuth(
      `/billout`,
      {
        people: payload,
        products: selectedProducts.map((p) => ({
          product: p.product.product,
          quantity: p.quantity,
        })),
      },
      "POST"
    )
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        navigate("/dashboard/stock")
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
      .finally(() => setSubmitting(false))
  }

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const sub = selectedProducts.reduce(
        (acc, p) => acc + p.product.product.price * p.quantity,
        0
      )
      setSubtotal(sub)
      setTotal(sub + sub * tax.tax)
    }
  }, [selectedProducts, tax])

  const fetchCustomer = () => {
    if (!getValues("dni")) return
    fetcherAuth(
      `/billout/find?dni=${getValues("prefix")}-${getValues("dni")}`
    ).then((res) => {
      reset({
        ...res.data,
        prefix: res.data.dni.split("-")[0],
        dni: res.data.dni.split("-")[1],
      })
    })
  }

  return (
    <Page title={`InverWencold | Registro de factura de salida`}>
      <form onSubmit={handleSubmit(create)}>
        <Card>
          <CardContent>
            <Grid container justifyContent="center" gap={2}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={700} marginBottom={0}>
                  Información del factura de salida
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={2}>
                  <Typography variant="body1" marginBottom={0}>
                    Información del cliente
                  </Typography>
                  <Grid container justifyContent="center">
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
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                fetchCustomer()
                              }
                            }}
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
                                  "La cedula debe tener al menos 8 carácteres",
                              },
                              pattern: {
                                value: /^[0-9]+$/,
                                message:
                                  "La cedula solo puede contener números",
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
                          autoComplete="off"
                          InputLabelProps={{
                            shrink: Boolean(watch("firstname")),
                          }}
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
                        />
                      </Grid>
                      <Grid item xs={12} md={6} paddingX={1} marginBottom={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Apellido (s)"
                          color={errors.lastname ? "error" : "primary"}
                          autoComplete="off"
                          InputLabelProps={{
                            shrink: Boolean(watch("lastname")),
                          }}
                          helperText={
                            errors.lastname && errors.lastname.message
                          }
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
                        InputLabelProps={{
                          shrink: Boolean(watch("phone")),
                        }}
                        color={errors.phone ? "error" : "primary"}
                        helperText={errors.phone && errors.phone.message}
                        value={watch("phone")}
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
                        InputLabelProps={{
                          shrink: Boolean(watch("address")),
                        }}
                        autoComplete="off"
                        color={errors.address ? "error" : "primary"}
                        helperText={errors.address && errors.address.message}
                        {...register("address")}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={2}>
                  <Typography variant="body1" marginBottom={0}>
                    Agregue los productos que desea facturar
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={provSearchProducts}
                      onChange={(e) => setProvSearchProducts(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setSearchProducts(provSearchProducts)
                          setPageProducts(1)
                        }
                      }}
                      label="Buscar productos"
                    />
                    <LoadingButton
                      size="small"
                      loading={loadingProducts}
                      disabled={loadingProducts}
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      onClick={() => {
                        if (provSearchProducts) {
                          setSearchProducts(provSearchProducts)
                        }
                      }}
                    >
                      Buscar
                    </LoadingButton>
                  </Stack>
                  {!loadingProducts ? (
                    products.length > 0 ? (
                      <Stack spacing={2}>
                        {products.map((product) => (
                          <ProductBillOutRow
                            key={product.id}
                            product={product}
                            lastExchange={lastExchange}
                            selectedProducts={selectedProducts}
                            handleAddProduct={handleAddProduct}
                          />
                        ))}
                        <Table>
                          <TableFooter>
                            <TableRow>
                              <TablePagination
                                sx={{ border: 0 }}
                                rowsPerPage={limitProducts}
                                count={totalProducts}
                                page={pageProducts - 1}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                labelRowsPerPage="Ordenes por página"
                              />
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </Stack>
                    ) : (
                      <Typography my={2} textAlign="center">
                        No hay productos para mostrar
                      </Typography>
                    )
                  ) : (
                    <Stack
                      spacing={2}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress />
                      <Typography variant="body1" color="textSecondary">
                        Cargando productos...
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {isValid && selectedProducts.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="start"
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        marginBottom={0}
                      >
                        Resúmen de la factura
                      </Typography>
                      <Typography variant="body1" marginBottom={0}>
                        Productos: {selectedProducts.length}
                      </Typography>
                    </Stack>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: 50 }}></TableCell>
                          <TableCell>Producto</TableCell>
                          <TableCell align="center">Precio</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedProducts.map((product, index) => (
                          <TableRow key={product.product.product.id}>
                            <TableCell sx={{ width: 50 }}>
                              <IconButton
                                onClick={() =>
                                  setSelectedProducts(
                                    selectedProducts.filter(
                                      (p, i) => i !== index
                                    )
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              {product.product.product.name}
                            </TableCell>
                            <TableCell align="center">
                              <NumberFormat
                                displayType="text"
                                value={product.product.product.price}
                                thousandSeparator
                                decimalScale={2}
                                suffix=" $"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <NumberFormat
                                type="number"
                                value={product.quantity}
                                customInput={TextField}
                                variant="standard"
                                inputProps={{
                                  min: 1,
                                  style: { textAlign: "right" },
                                  max: allLoadedProducts.find(
                                    (p) =>
                                      p.product.id ===
                                      product.product.product.id
                                  ).available,
                                }}
                                decimalScale={0}
                                onValueChange={(values) => {
                                  const { value } = values
                                  setSelectedProducts(
                                    selectedProducts.map((p, i) =>
                                      i === index
                                        ? {
                                            ...p,
                                            quantity: value,
                                          }
                                        : p
                                    )
                                  )
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <NumberFormat
                                displayType="text"
                                value={
                                  product.product.product.price *
                                  product.quantity
                                }
                                thousandSeparator
                                decimalScale={2}
                                suffix=" $"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Stack alignItems="end">
                      <Typography variant="body2" color="textSecondary">
                        Subtotal
                      </Typography>
                      <Typography variant="body1">
                        <NumberFormat
                          value={subtotal}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                          suffix=" $"
                          displayType="text"
                        />
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {tax.description}
                      </Typography>
                      <Typography variant="body1">
                        <NumberFormat
                          value={subtotal * tax.tax}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                          suffix=" $"
                          displayType="text"
                        />
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total
                      </Typography>
                      <Typography variant="body1">
                        <NumberFormat
                          value={total}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                          suffix=" $"
                          displayType="text"
                        />
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total en bolivares
                      </Typography>
                      <Typography variant="body1">
                        <NumberFormat
                          value={total * lastExchange}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                          suffix=" BsD"
                          displayType="text"
                        />
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton
                    fullWidth
                    loading={submitting}
                    disabled={submitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Realizar venta
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </form>
    </Page>
  )
}

export default CreateBillOut
