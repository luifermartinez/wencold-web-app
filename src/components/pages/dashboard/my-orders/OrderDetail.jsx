import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import moment from "moment"
import NumberFormat from "react-number-format"
import orderStatus from "@/constants/orderStatus"
import PaidIcon from "@mui/icons-material/Paid"
import { useReactToPrint } from "react-to-print"
import Logo from "@/components/common/Logo"

const OrderDetail = () => {
  const { id } = useParams()
  const { setMessage, user, setMode, mode } = useContext(AppContext)
  const navigate = useNavigate()
  const ref = useRef()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [isPayable, setIsPayable] = useState(false)

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => {
      if (mode === "dark") {
        setMode("dark")
      }
    },
  })
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.between("xs", "sm"))

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

      // check if exist a payment with status "pending" or "approved"
      const existPendingPayment = order.payment.some(
        (payment) =>
          payment.status === "pending" || payment.status === "approved"
      )
      setIsPayable(!existPendingPayment)
    }
  }, [order])

  const pay = () => {
    navigate(`/dashboard/my-payments/new/${id}`)
  }

  return (
    <Page title="InverWencold | Detalle de orden">
      {order && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                if (mode === "dark") {
                  setMode("light")
                }
                new Promise((resolve) => resolve()).then(() => {
                  handlePrint()
                })
              }}
              fullWidth
            >
              Imprimir
            </Button>
          </CardContent>
        </Card>
      )}
      <Card ref={ref}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            {!loading ? (
              order ? (
                <Stack spacing={2} sx={{ width: "100%" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">Orden {order?.code}</Typography>
                    <Typography variant="h6">
                      {moment(order.createdAt).format("DD/MM/YYYY")}
                    </Typography>
                  </Stack>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <Logo size="h5" />
                      <Typography variant="body2" color="textSecondary" mt={2}>
                        Cliente
                      </Typography>
                      <Typography variant="body1">
                        {order.people.firstname} {order.people.lastname}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        DNI o cédula de identidad
                      </Typography>
                      <Typography variant="body1">
                        <NumberFormat
                          displayType="text"
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix={`${order.people.dni.slice(0, 1)}-`}
                          value={order.people.dni.slice(2)}
                        />
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1">
                        {order.people.phone ? (
                          <NumberFormat
                            displayType="text"
                            value={order.people.phone}
                            format="(###) ###-####"
                          />
                        ) : (
                          "No agregado"
                        )}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Dirección
                      </Typography>
                      <Typography variant="body1">
                        {order.people.address
                          ? order.people.address
                          : "No agregado"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        mt: xs ? 2 : 0,
                        borderTop: xs ? 1 : 0,
                        pt: xs ? 2 : 0,
                      }}
                    >
                      <Stack
                        alignItems={xs ? "start" : "end"}
                        justifyContent={"end"}
                        sx={{ height: "100%", width: "100%" }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Estado
                        </Typography>
                        <Chip
                          label={orderStatus[order.status]}
                          variant="outlined"
                          sx={{
                            width: xs ? "100%" : "auto",
                            borderRadius: 1,
                            my: 1,
                          }}
                          color={
                            order.status === "pending"
                              ? "warning"
                              : order.status === "refused"
                              ? "error"
                              : "primary"
                          }
                        />
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
                          {order.tax.description}
                        </Typography>
                        <Typography variant="body1">
                          <NumberFormat
                            value={tax}
                            thousandSeparator
                            decimalScale={2}
                            fixedDecimalScale
                            suffix=" $"
                            displayType="text"
                          />
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Stack>
                            <Typography variant="body2" color="textSecondary">
                              Total en bolivares
                            </Typography>
                            <Typography variant="body1">
                              <NumberFormat
                                value={total * order.exchange.bsEquivalence}
                                thousandSeparator
                                decimalScale={2}
                                fixedDecimalScale
                                suffix=" BsD"
                                displayType="text"
                              />
                            </Typography>
                          </Stack>
                          <Stack align="end">
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
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell align="right">Precio unitario</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.billOutProducts.map((bop) => (
                        <TableRow key={bop.id}>
                          <TableCell>{bop.product.name}</TableCell>
                          <TableCell align="center">{bop.quantity}</TableCell>
                          <TableCell align="right">
                            <NumberFormat
                              value={bop.product.price}
                              thousandSeparator
                              decimalScale={2}
                              fixedDecimalScale
                              suffix=" $"
                              displayType="text"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Stack alignItems="end">
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
                        value={total * order.exchange.bsEquivalence}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                        suffix=" BsD"
                        displayType="text"
                      />
                    </Typography>
                  </Stack>
                  {isPayable && user.role === "customer" && (
                    <Button
                      variant="contained"
                      startIcon={<PaidIcon />}
                      onClick={pay}
                    >
                      Pagar
                    </Button>
                  )}
                </Stack>
              ) : (
                <>
                  <Typography variant="h6">Orden no encontrada</Typography>
                </>
              )
            ) : (
              <>
                <CircularProgress />
                <Typography>Cargando...</Typography>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}
export default OrderDetail
