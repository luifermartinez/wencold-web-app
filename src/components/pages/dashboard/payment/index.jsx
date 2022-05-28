import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import PaymentRow from "./PaymentRow"

const Payments = () => {
  const { setMessage, user } = useContext(AppContext)
  const [payment, setPayments] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const title = user?.role === "admin" ? "Pagos" : "Mis pagos"

  const fetchPayments = useCallback(() => {
    setLoading(true)
    fetcherAuth(
      `/payment?page=${page}&limit=${limit} ${
        startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : ""
      }`
    )
      .then((res) => {
        setPayments(res.data)
        setTotal(res.total)
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false))
  }, [page, limit, startDate, endDate])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleChangePage = (event, value) => {
    setPage(value + 1)
  }

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(1)
  }

  return (
    <Page title={`InverWencold | ${title}`}>
      <Banner
        title={title}
        description="Ve el estado actual de los pagos realizados"
      />
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Grid container gap={2}>
              <Grid item xs={12} sm={6} md lg>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Fecha de inicio"
                  defaultValue={new Date().toISOString().split("T")[0]}
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
                />
              </Grid>
              <Grid item xs={12} sm={6} md lg>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Fecha de fin"
                  defaultValue={new Date().toISOString().split("T")[0]}
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
                />
              </Grid>
            </Grid>
            {!loading ? (
              payment.length > 0 ? (
                <Stack>
                  <Grid container>
                    {payment.map((payment) => (
                      <PaymentRow
                        payment={payment}
                        key={payment.id}
                        mutate={fetchPayments}
                      />
                    ))}
                  </Grid>
                  <TablePagination
                    sx={{ border: 0 }}
                    rowsPerPage={limit}
                    count={total}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Pagos por página"
                  />
                </Stack>
              ) : (
                <Stack alignItems="center">
                  <Typography>No hay pagos para mostrar</Typography>
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
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}

export default Payments
