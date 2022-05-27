import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
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
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import { useNavigate } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { useCallback, useContext, useEffect, useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"
import ProviderRow from "./ProviderRow"

const Providers = () => {
  const navigate = useNavigate()
  const { setMessage } = useContext(AppContext)

  const [provSearch, setProvSearch] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [status, setStatus] = useState("")

  const fetchProviders = useCallback(() => {
    setLoading(true)
    fetcherAuth(
      `/provider?page=${page + 1}&limit=${limit}${
        search ? `&search=${search}` : ""
      } ${status ? `&status=${status}` : ""}`
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
    fetchProviders()
  }, [fetchProviders])

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
    <Page title="InverWencold | Proveedores">
      <Banner
        title="Proveedores"
        description="Módulo de proveedores, en este módulo podrás gestionar los proveedores de la aplicación."
      >
        <Stack justifyContent={"end"} spacing={2} direction="row">
          <Button
            variant="contained"
            startIcon={<LocalShippingIcon />}
            size="small"
            onClick={() => navigate("new")}
          >
            Crear proveedor
          </Button>
        </Stack>
      </Banner>
      <Card>
        <CardContent sx={{ overflowX: "auto" }}>
          <Stack
            direction={"row"}
            sx={{ mb: 3 }}
            justifyContent="space-between"
          >
            <Typography variant="h5" fontWeight={700} marginBottom={0}>
              Lista de proveedores
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1">Filtrar por estado</Typography>
              <Select
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="deleted">Desactivados</MenuItem>
              </Select>
            </Stack>
          </Stack>
          <Grid container gap={1}>
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Buscar proveedores"
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
                      setPage(0)
                    }
                  }}
                >
                  Buscar
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
          <Stack spacing={1}>
            <Table sx={{ borderRadius: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>DNI</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="center">Número de teléfono</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  data.length > 0 ? (
                    data.map((item) => (
                      <ProviderRow key={item.id} provider={item} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">
                            No hay proveedores para mostrar
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
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
                          Cargando proveedores
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box>
              <Stack direction="row" justifyContent="end" alignItems="center">
                <TablePagination
                  sx={{ mt: 2, width: "100%" }}
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

export default Providers
