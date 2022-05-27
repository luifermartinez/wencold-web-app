import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import { useNavigate } from "react-router-dom"
import AddCardIcon from "@mui/icons-material/AddCard"
import SearchIcon from "@mui/icons-material/Search"
import { LoadingButton } from "@mui/lab"
import PaymentMethodRow from "./PaymentMethodRow"

const PaymentMethods = () => {
  const navigate = useNavigate()
  const { setMessage } = useContext(AppContext)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [provSearch, setProvSearch] = useState("")
  const [status, setStatus] = useState("all")

  const fetchPaymentMethods = useCallback(() => {
    setLoading(true)

    let STATUS = ""
    if (status === "active") {
      STATUS = "&status=1"
    }
    if (status === "inactive") {
      STATUS = "&status=0"
    }
    fetcherAuth(
      `/payment-methods?page=${page + 1}&limit=${limit} ${
        search ? `&search=${search}` : ""
      } ${STATUS}`
    )
      .then((res) => {
        setData(res.data)
        setTotal(res.total)
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, limit, search, status])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  useEffect(() => {
    if (provSearch === "") setSearch("")
  }, [provSearch])

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Card>
      <CardContent sx={{ overflowX: "auto" }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" component="h2">
              Métodos de pago
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddCardIcon />}
              onClick={() => navigate("payment-methods")}
            >
              Agregar método de pago
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Buscar método de pago"
              variant="outlined"
              fullWidth
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
              loading={loading}
              disabled={loading}
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={() => {
                if (provSearch) {
                  setSearch(provSearch)
                }
              }}
            >
              Buscar
            </LoadingButton>
          </Stack>
          <FormControl variant="outlined" fullWidth size="small">
            <InputLabel id="status">Filtrar por estado</InputLabel>
            <Select
              labelId="status"
              id="status"
              value={status}
              label="Filtrar por estado"
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value={"all"}>Todos</MenuItem>
              <MenuItem value={"active"}>Activos</MenuItem>
              <MenuItem value={"inactive"}>Desactivados</MenuItem>
            </Select>
          </FormControl>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Propietario</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Correo electrónico</TableCell>
                <TableCell align="center">Teléfono</TableCell>
                <TableCell align="center">Banco</TableCell>
                <TableCell align="center" sx={{whiteSpace: 'nowrap'}}>Número de cuenta</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                data.length > 0 ? (
                  data.map((item) => (
                    <PaymentMethodRow key={item.id} paymentMethod={item} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
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
                  <TableCell colSpan={9}>
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
                        Cargando métodos de pago
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
  )
}

export default PaymentMethods
