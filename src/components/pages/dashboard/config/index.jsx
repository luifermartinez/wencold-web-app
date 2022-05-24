import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import ExchageRow from "./ExchangeRow"
import moment from "moment"
import ExchangeCreate from "./ExchangeCreate"
import AddIcon from "@mui/icons-material/Add"

const Config = () => {
  const { setMessage } = useContext(AppContext)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingToday, setLoadingToday] = useState(false)
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
    setLoadingToday(true)
    fetcherAuth(`/exchange/today`)
      .then((res) => {
        if (res.data) {
          setToday(res.data)
        }
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
      .finally(() => {
        setLoadingToday(false)
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
    <Page title="InverWencold | Configuración">
      <Banner
        title="Configuración"
        description="Configuración general de la aplicación, en este módulo podrás configurar tasa de cambio del día, y métodos de pago."
      >
        <Stack justifyContent={"end"} spacing={2} direction="row">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={handleOpen}
          >
            Crear tasa de cambio
          </Button>
        </Stack>
      </Banner>
      <Card>
        <CardContent sx={{ overflowX: "auto" }}>
          <Typography variant="h5" component="h2">
            Tasas de cambio
          </Typography>
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
                {data &&
                  data.map((item) => (
                    <ExchageRow
                      key={item.id}
                      {...item}
                      handleEdit={handleEdit}
                    />
                  ))}
              </TableBody>
            </Table>
            <Box>
              <Stack direction="row" justifyContent="end" alignItems="center">
                <Stack direction="row">
                  <TablePagination
                    sx={{ mt: 2 }}
                    rowsPerPage={limit}
                    count={total}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <ExchangeCreate
        isOpen={isOpen}
        handleClose={handleClose}
        mutate={fetchExchanges}
        exchange={selected}
      />
    </Page>
  )
}

export default Config
