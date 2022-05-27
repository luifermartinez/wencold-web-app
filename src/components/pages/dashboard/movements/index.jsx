import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { LoadingButton } from "@mui/lab"
import {
  Box,
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
} from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import { AppContext } from "@/context/AppContext"
import moment from "moment"
import { fetcherAuth } from "@/helpers/fetch"
import MovementRow from "./MovementRow"

const Movements = () => {
  const { setMessage } = useContext(AppContext)
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [provSearch, setProvSearch] = useState("")
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  const fetchMovements = useCallback(() => {
    if (startDate && dateEnd) {
      if (moment(dateEnd).isBefore(startDate)) {
        return setMessage({
          type: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
        })
      }
    }
    setLoading(true)
    fetcherAuth(
      `/movements?page=${page}&limit=${limit}${
        search ? `&search=${search}` : ""
      } ${
        startDate && dateEnd
          ? `&startDate=${moment(startDate)
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss")}&dateEnd=${moment(dateEnd)
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")}`
          : ""
      }`
    )
      .then((res) => {
        setMovements(res.data)
        setTotal(res.total)
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, limit, search, startDate, dateEnd])

  useEffect(() => {
    fetchMovements()
  }, [fetchMovements])

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Page title="InverWencold | Movimientos">
      <Banner
        title="Movimientos"
        description="Listado de movimientos realizados en el inventario."
      />
      <Card>
        <CardContent sx={{ overflowX: "auto" }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5" component="h2">
                Listado de movimientos
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                label="Buscar"
                variant="outlined"
                size="small"
                value={provSearch}
                onChange={(e) => setProvSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearch(provSearch)
                    setPage(0)
                  }
                }}
              />
              <LoadingButton
                variant="outlined"
                size="small"
                startIcon={<SearchIcon />}
                onClick={() => setSearch(provSearch)}
              >
                Buscar
              </LoadingButton>
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField
                size="small"
                type="date"
                label="Fecha de inicio"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value)
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                type="date"
                label="Fecha de fin"
                value={dateEnd}
                onChange={(event) => {
                  setDateEnd(event.target.value)
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Movimiento #</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="center">Fecha del movimiento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  movements.length > 0 ? (
                    movements.map((obj) => (
                      <MovementRow key={obj.id} movement={obj} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No hay movimientos para mostrar
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box>
              <Stack direction="row" justifyContent="end" alignItems="center">
                <TablePagination
                  sx={{ width: "100%" }}
                  rowsPerPage={limit}
                  count={total}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}

export default Movements
