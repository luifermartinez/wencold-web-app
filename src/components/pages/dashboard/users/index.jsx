import Page from "@/components/utils/Page"
import { fetcherAuth } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
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
import SearchIcon from "@mui/icons-material/Search"
import { AppContext } from "@/context/AppContext"
import UserRow from "./UserRow"
import Banner from "@/components/common/Banner"
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { useNavigate } from "react-router-dom"

const Users = () => {
  const { setMessage } = useContext(AppContext)
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [provSearch, setProvSearch] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [status, setStatus] = useState("")

  const fetchUsers = useCallback(() => {
    setLoading(true)
    fetcherAuth(
      `/users?page=${page + 1}&limit=${limit}${
        search ? `&search=${search}` : ""
      } ${selectedRole ? `&role=${selectedRole}` : ""} ${
        status ? `&status=${status}` : ""
      }`
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
  }, [page, limit, search, selectedRole, status])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

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
    <Page title="InverWencold | Usuarios">
      <Banner
        title="Usuarios"
        description="Módulo de usuarios, en este módulo podrás gestionar los usuarios de la aplicación."
      >
        <Stack justifyContent={"end"} spacing={2} direction="row">
          <Button
            variant="contained"
            startIcon={<AssignmentIndIcon />}
            size="small"
            onClick={() => navigate("new", { state: { role: "manager" } })}
          >
            Crear encargado
          </Button>
          <Button
            variant="contained"
            startIcon={<SupervisorAccountIcon />}
            size="small"
            onClick={() => navigate("new", { state: { role: "admin" } })}
          >
            Crear administrador
          </Button>
        </Stack>
      </Banner>
      <Card>
        <CardContent sx={{ overflowX: "auto" }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={700} marginBottom={0}>
              Lista de usuarios
            </Typography>
          </Box>
          <Grid container gap={1}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Buscar usuarios"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={provSearch}
                  onChange={(e) => setProvSearch(e.target.value)}
                />
                <LoadingButton
                  fullWidth
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1} direction="row">
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel id="role">Filtrar por rol</InputLabel>
                  <Select
                    labelId="role"
                    id="role"
                    value={selectedRole}
                    label="Filtrar por rol"
                    onChange={(event) => setSelectedRole(event.target.value)}
                  >
                    <MenuItem value={""}>Todos</MenuItem>
                    <MenuItem value={"admin"}>Administrador</MenuItem>
                    <MenuItem value={"manager"}>Encargado</MenuItem>
                    <MenuItem value={"customer"}>Cliente</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel id="status">Filtrar por estado</InputLabel>
                  <Select
                    labelId="status"
                    id="status"
                    value={status}
                    label="Filtrar por estado"
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <MenuItem value={""}>Todos</MenuItem>
                    <MenuItem value={"active"}>Activo</MenuItem>
                    <MenuItem value={"banned"}>Baneado</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
          <Stack spacing={1}>
            <Table sx={{ borderRadius: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>DNI</TableCell>
                  <TableCell>Nombre completo</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Rol</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((user) => (
                    <UserRow key={user.id} user={user} mutate={fetchUsers} />
                  ))}
              </TableBody>
            </Table>
            <Box>
              <Stack direction="row" justifyContent="end" alignItems="center">
                <TablePagination
                  sx={{ mt: 2 }}
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

export default Users
