import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { useCallback, useContext, useEffect, useState } from "react"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableFooter,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import OrderRow from "./OrderRow"
import OutboxIcon from "@mui/icons-material/Outbox"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const Orders = () => {
  const navigate = useNavigate()
  const { setMessage, user } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tax, setTax] = useState(0)
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)
  const title = user.role === "admin" ? "Ordenes" : "Mis ordenes"

  const fetchPayments = useCallback(() => {
    setLoading(true)
    fetcherAuth(
      `/billout?page=${page}&limit=${limit} ${
        startDate && endDate
          ? `&startDate=${moment(startDate)
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss")}&endDate=${moment(endDate)
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss")}`
          : ""
      }`
    )
      .then((res) => {
        setOrders(res.data)
        setTotal(res.total)
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false))
  }, [page, limit, startDate, endDate])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const fetchTax = useCallback(() => {
    setLoading(true)
    fetcherAuth("/tax")
      .then((res) => {
        setTax(res.data.tax)
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTax()
  }, [fetchTax])

  const handleChangePage = (event, value) => {
    setPage(value + 1)
  }

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(1)
  }

  return (
    <Page title={`InverWencold | ${title}`}>
      {user.role !== "manager" && (
        <Banner title={title} description="Ordenes realizadas." />
      )}
      <Card>
        <CardContent>
          <Grid container gap={2} marginBottom={2}>
            {user.role === "manager" && (
              <Grid item container xs={12} justifyContent="end">
                <Grid item xs={12} sm={12} md={5} lg={4}>
                  <Stack direction="row" justifyContent="end">
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<OutboxIcon />}
                      onClick={() => navigate("order")}
                    >
                      Realizar venta
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12} sm={12} md lg>
              <TextField
                size="small"
                fullWidth
                type="date"
                label="Fecha de inicio"
                value={startDate}
                onChange={(event) => {
                  if (endDate && event.target.value > endDate) {
                    setMessage({
                      type: "error",
                      text: "La fecha de inicio no puede ser mayor a la fecha final",
                    })
                    return
                  }
                  setStartDate(event.target.value)
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md lg>
              <TextField
                size="small"
                fullWidth
                type="date"
                label="Fecha de fin"
                value={endDate}
                onChange={(event) => {
                  if (new Date(event.target.value) >= new Date(startDate)) {
                    setEndDate(event.target.value)
                  } else {
                    setMessage({
                      type: "error",
                      text: "La fecha de fin no puede ser menor a la fecha de inicio",
                    })
                  }
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          {!loading ? (
            orders.length > 0 ? (
              <Stack spacing={2}>
                {orders.map((order) => (
                  <OrderRow order={order} key={order.id} tax={tax} />
                ))}
                <Table>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        sx={{ border: 0 }}
                        rowsPerPage={limit}
                        count={total}
                        page={page - 1}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Ordenes por página"
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Stack>
            ) : (
              <Stack alignItems="center">
                <Typography>No hay ordenes para mostrar</Typography>
              </Stack>
            )
          ) : (
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography>
                Cargando pagos, por favor espere un momento...
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Page>
  )
}
export default Orders
