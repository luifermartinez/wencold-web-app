import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth, fetcherAuthFormData } from "@/helpers/fetch"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { LoadingButton } from "@mui/lab"
import { useNavigate, useParams } from "react-router-dom"
import PaidIcon from "@mui/icons-material/Paid"

const CreatePayment = () => {
  const { id } = useParams()

  const navigate = useNavigate()
  const { setMessage } = useContext(AppContext)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const { shape, palette } = useTheme()
  const [lastExchange, setLastExchange] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const inputImage = useRef()
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [tax, setTax] = useState(0)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      paymentProof: null,
      reference: "",
      amountRef: "",
      paymentMethod: "",
    },
  })

  const fetchOrder = useCallback(() => {
    setLoading(true)
    fetcherAuth(`/billout/${id}`)
      .then((res) => {
        setOrder(res.data)
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  useEffect(() => {
    if (order) {
      const price = order.billOutProducts
        .map((bop) => bop.product.price * bop.quantity)
        .reduce((a, b) => a + b, 0)
      setSubtotal(price)
      setTotal(price + price * order.tax.tax)
      setTax(order.tax.tax * price)
      setValue("amountRef", total)
    }
  }, [order])

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

  const fetchPaymentMethods = useCallback(() => {
    fetcherAuth(`/payment-methods?page=1&limit=10000`)
      .then((res) => {
        setPaymentMethods(res.data)
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
  }, [])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const create = (values) => {
    setSubmitting(true)
    const { amountRef, reference, paymentMethod, paymentProof } = values
    const fd = new FormData()
    fd.append("amountRef", amountRef.toFixed(2))
    fd.append("reference", reference)
    fd.append("paymentMethod", paymentMethod)
    fd.append("billOutCode", order.code)
    if (paymentProof) {
      fd.append("paymentProof", paymentProof)
    }
    fetcherAuthFormData("/payment", fd, "POST")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        navigate("/dashboard/my-payments")
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: err.message,
        })
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <Page title="InverWencold | Pago">
      <Banner title="Registro de pago" />
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Resumen de la órden</Typography>
            <Grid container justifyContent="center" gap={2}>
              {!loading ? (
                order ? (
                  <>
                    {order.billOutProducts?.map((bop) => {
                      const image =
                        bop.product.productImage.length > 0
                          ? `${
                              import.meta.env.VITE_BACKEND_API
                            }/image?imagePath=${
                              bop.product.productImage[0].image.path
                            }`
                          : `${
                              import.meta.env.VITE_BACKEND_API
                            }/image?imagePath=default/default-product.png`
                      return (
                        <Grid key={bop.id} container item xs={12}>
                          <Grid item xs>
                            <Box sx={{ height: 150, width: 150 }}>
                              <img
                                src={image}
                                alt="product image"
                                width={150}
                                height={150}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: shape.borderRadius,
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={10}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ height: "100%" }}
                            >
                              <Stack>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Nombre del producto
                                </Typography>
                                <Typography variant="body1">
                                  {bop.product.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Tipo de producto
                                </Typography>
                                <Typography variant="body1">
                                  {bop.product.productType.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Descripción
                                </Typography>
                                <Typography variant="body1">
                                  {bop.product.productType.description}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={2}
                                alignItems="start"
                              >
                                <Stack
                                  justifyContent={"space-between"}
                                  sx={{ height: "100%" }}
                                >
                                  <Stack alignItems="end">
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Cantidad
                                    </Typography>
                                    <Typography variant="body1">
                                      {bop.quantity}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Precio unitario
                                    </Typography>
                                    <Typography variant="body1">
                                      {Number(bop.product.price).toFixed(2)} $
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Precio
                                    </Typography>
                                    <Typography variant="body1">
                                      {Number(
                                        bop.product.price * bop.quantity
                                      ).toFixed(2)}{" "}
                                      $
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                      )
                    })}
                    <Grid
                      item
                      xs={12}
                      justifyContent="end"
                      sx={{ borderTop: 1, pt: 2 }}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <Stack justifyContent="end">
                          <Typography variant="body2" color="textSecondary">
                            Tasa actual
                          </Typography>
                          <Typography variant="h6">
                            {lastExchange?.toFixed(2)} BsD
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Impuesto actual
                          </Typography>
                          <Typography variant="h6">
                            {tax?.tax * 100} % IVA
                          </Typography>
                        </Stack>
                        <Stack alignItems="end" justifyContent="end">
                          <Typography variant="body2" color="textSecondary">
                            Subtotal
                          </Typography>
                          <Typography variant="h6">
                            <NumberFormat
                              displayType="text"
                              value={subtotal}
                              thousandSeparator
                              decimalScale={2}
                              suffix=" $"
                            />
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {tax?.description}
                          </Typography>
                          <Typography variant="h6">
                            <NumberFormat
                              displayType="text"
                              value={tax}
                              thousandSeparator
                              decimalScale={2}
                              suffix=" $"
                            />
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                          >
                            <Stack alignItems="end">
                              <Typography variant="body2" color="textSecondary">
                                Total en bolivares
                              </Typography>
                              <Typography variant="h6">
                                <NumberFormat
                                  displayType="text"
                                  value={total * lastExchange}
                                  thousandSeparator
                                  decimalScale={2}
                                  suffix=" BsD"
                                />
                              </Typography>
                            </Stack>
                            <Stack alignItems="end">
                              <Typography variant="body2" color="textSecondary">
                                Total
                              </Typography>
                              <Typography variant="h6">
                                <NumberFormat
                                  displayType="text"
                                  value={total}
                                  thousandSeparator
                                  decimalScale={2}
                                  suffix=" $"
                                />
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Stack spacing={2}></Stack>
                  </>
                ) : (
                  <Stack sx={{ p: 3 }} spacing={2} alignItems="center">
                    <Typography>Orden no encontrada</Typography>
                  </Stack>
                )
              ) : (
                <Stack sx={{ p: 3 }} spacing={2} alignItems="center">
                  <CircularProgress />
                  <Typography>Cargando productos...</Typography>
                </Stack>
              )}
            </Grid>
          </Stack>
        </CardContent>
      </Card>
      {order?.billOutProducts?.length > 0 && (
        <Card sx={{ mt: 2 }} component="form" onSubmit={handleSubmit(create)}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Seleccione un método de pago</Typography>
              <Stack spacing={1}>
                {paymentMethods?.map((pm) => (
                  <Stack
                    key={pm.id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderRadius: 1,
                      borderColor: palette.divider,
                      cursor: "pointer",
                      backgroundColor:
                        watch("paymentMethod") === pm.id
                          ? palette.primary.main
                          : "transparent",
                      color:
                        watch("paymentMethod") === pm.id
                          ? palette.primary.contrastText
                          : palette.text.primary,
                    }}
                    onClick={() => setValue("paymentMethod", pm.id)}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {pm.name}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {pm.dni}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {pm.ownerName}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {pm.bankName}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {pm.email}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {pm.phoneNumber}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {pm.accountNumber}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <NumberFormat
                customInput={TextField}
                label="Monto"
                disabled
                decimalSeparator="."
                size="small"
                value={watch("amountRef")}
                suffix={` $ | ${Number(total * lastExchange).toFixed(2)} BsD`}
              />
              <TextField
                label="Referencia"
                {...register("reference", {
                  required: "Este campo es requerido",
                })}
                size="small"
                helperText={errors.reference && errors.reference.message}
                color={errors.reference ? "error" : "primary"}
              />
              <input
                ref={inputImage}
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setValue("paymentProof", e.target.files[0])
                  }
                }}
                style={{ display: "none" }}
              />
              {watch("paymentProof") && (
                <Stack direction="row" justifyContent={"center"}>
                  <Box sx={{ position: "relative", height: 150, width: 150 }}>
                    <IconButton
                      sx={{
                        position: "absolute",
                        right: 5,
                        top: 5,
                        backgroundColor: palette.background.paper,
                        border: 1,
                        borderColor: palette.divider,
                      }}
                      onClick={() => setValue("paymentProof", null)}
                      size="small"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                    <img
                      src={URL.createObjectURL(watch("paymentProof"))}
                      alt="payment proof"
                      height={150}
                      width={150}
                      style={{
                        objectFit: "contain",
                        borderRadius: shape.borderRadius,
                      }}
                    />
                  </Box>
                </Stack>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  inputImage.current.click()
                }}
              >
                {watch("paymentProof")
                  ? "Cambiar prueba de pago"
                  : "Agregar prueba de pago"}
              </Button>
              <LoadingButton
                loading={submitting}
                type="submit"
                variant="contained"
                startIcon={<PaidIcon />}
              >
                Registrar pago
              </LoadingButton>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Page>
  )
}

export default CreatePayment
