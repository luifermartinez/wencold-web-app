import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import { useCallback, useContext, useEffect, useState } from "react"
import ExchangeCreate from "./ExchangeCreate"
import {
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  Box,
  TableCell,
  TableBody,
  TableHead,
  Table,
  Stack,
  TextField,
  Button,
  CardContent,
  Card,
  useTheme,
} from "@mui/material"
import moment from "moment"
import AddIcon from "@mui/icons-material/Add"
import ExchageRow from "./ExchangeRow"

const Exchange = () => {
  const { setMessage } = useContext(AppContext)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [today, setToday] = useState(null)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [startDate, setStartDate] = useState(null)
  const [dateEnd, setDateEnd] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()
  const [selected, setSelected] = useState(null)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const fetchExchangeToday = useCallback(() => {
    fetcherAuth(`/exchange/today`)
      .then((res) => {
        if (res.data) {
          setToday(res.data)
        }
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
  }, [])

  useEffect(() => {
    fetchExchangeToday()
  }, [fetchExchangeToday])

  const fetchExchanges = useCallback(() => {
    setLoading(true)
    let url = `/exchange?page=${page + 1}&limit=${limit}`
    if (startDate && !dateEnd)
      url += `&date=${moment(startDate)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss")}`
    if (startDate && dateEnd)
      url += `&date=${moment(startDate)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss")}&dateEnd=${moment(dateEnd)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss")}`
    fetcherAuth(url)
      .then((res) => {
        setData(res.data)
        setTotal(res.total)
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
      .finally(() => setLoading(false))
  }, [page, limit, startDate, dateEnd])

  useEffect(() => {
    fetchExchanges()
  }, [fetchExchanges])

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEdit = (obj) => {
    setSelected(obj)
    handleOpen()
  }

  useEffect(() => {
    if (!isOpen) {
      setSelected(null)
    }
  }, [isOpen])
  return (
    <>
      <Card>
        <CardContent sx={{ overflowX: "auto" }}>
          <Stack justifyContent="space-between" spacing={2} direction="row">
            <Typography variant="h5" component="h2">
              Tasas de cambio
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleOpen}
            >
              Crear tasa de cambio
            </Button>
          </Stack>
          <Stack direction="row" mt={2} mb={2} justifyContent="space-between">
            <Stack spacing={2} direction="row">
              <TextField
                size="small"
                type="date"
                label="Fecha de inicio"
                defaultValue={new Date().toISOString().split("T")[0]}
                value={startDate}
                onChange={(event) => {
                  if (dateEnd && event.target.value > dateEnd) {
                    setMessage({
                      type: "error",
                      text: "La fecha de inicio no puede ser mayor a la fecha final",
                    })
                    return
                  }
                  setStartDate(event.target.value)
                }}
              />
              <TextField
                size="small"
                type="date"
                label="Fecha de fin"
                defaultValue={new Date().toISOString().split("T")[0]}
                value={dateEnd}
                onChange={(event) => {
                  if (new Date(event.target.value) >= new Date(startDate)) {
                    setDateEnd(event.target.value)
                  } else {
                    setMessage({
                      type: "error",
                      text: "La fecha de fin no puede ser menor a la fecha de inicio",
                    })
                  }
                }}
              />
            </Stack>
            <Box>
              <Typography
                variant="button"
                color="primary"
                padding={theme.spacing(1)}
                border={1}
                borderRadius={1}
                noWrap
              >
                Tasa de hoy:
                {today
                  ? `${today?.bsEquivalence.toFixed(2)} BsD`
                  : "Aún no hay tasa de hoy"}
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tasa por 1 $</TableCell>
                  <TableCell align="center">Fecha de creación</TableCell>
                  <TableCell align="center">Fecha de actualización</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  data.length > 0 ? (
                    data.map((item) => (
                      <ExchageRow
                        key={item.id}
                        {...item}
                        handleEdit={handleEdit}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">
                            No hay tasas de cambio para mostrar
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <CircularProgress sx={{ mb: 3 }} />
                        <Typography variant="h6">
                          Cargando tasas de cambio
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TablePagination
                    sx={{ mt: 2 }}
                    rowsPerPage={limit}
                    count={total}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
        </CardContent>
      </Card>
      <ExchangeCreate
        isOpen={isOpen}
        handleClose={handleClose}
        mutate={fetchExchanges}
        exchange={selected}
      />
    </>
  )
}

export default Exchange
