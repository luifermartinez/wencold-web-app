import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
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
} from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import { LoadingButton } from "@mui/lab"
import SearchIcon from "@mui/icons-material/Search"
import EntryRow from "@/components/pages/dashboard/stock/EntryRow"
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox"
import { useNavigate } from "react-router-dom"

const EntryInvoice = () => {
  const navigate = useNavigate()
  const { setMessage } = useContext(AppContext)
  const [entries, setEntries] = useState([])
  const [loadingEntries, setLoadingEntries] = useState(false)
  const [pageEntries, setPageEntries] = useState(0)
  const [limitEntries, setLimitEntries] = useState(10)
  const [provSearchEntries, setProvSearchEntries] = useState("")
  const [totalEntries, setTotalEntries] = useState(0)
  const [searchEntries, setSearchEntries] = useState("")

  const fetchEntries = useCallback(async () => {
    setLoadingEntries(true)
    fetcherAuth(
      `/entry?page=${pageEntries + 1}&limit=${limitEntries}${
        searchEntries ? `&search=${searchEntries}` : ""
      }`
    )
      .then((res) => {
        setEntries(res.data)
        setTotalEntries(res.total)
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
      .finally(() => setLoadingEntries(false))
  }, [pageEntries, limitEntries, searchEntries])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  useEffect(() => {
    if (provSearchEntries === "") setSearchEntries("")
  }, [provSearchEntries])

  const handleChangePageEntries = (event, value) => {
    setPageEntries(value)
  }

  const handleChangeRowsPerPageEntries = (event) => {
    setLimitEntries(parseInt(event.target.value, 10))
    setPageEntries(0)
  }

  return (
    <Card>
      <CardContent sx={{ overflowX: "auto" }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" component="h2">
              Entradas de productos
            </Typography>
            <Button
              variant="contained"
              startIcon={<MoveToInboxIcon />}
              size="small"
              onClick={() => navigate("entry")}
            >
              Realizar entrada
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              label="Buscar"
              variant="outlined"
              size="small"
              value={provSearchEntries}
              onChange={(e) => setProvSearchEntries(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setSearchEntries(provSearchEntries)
                  setPageEntries(0)
                }
              }}
            />
            <LoadingButton
              variant="outlined"
              size="small"
              startIcon={<SearchIcon />}
              onClick={() => setSearchEntries(provSearchEntries)}
            >
              Buscar
            </LoadingButton>
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell align="center">Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loadingEntries ? (
                entries.length > 0 ? (
                  entries.map((obj) => (
                    <EntryRow key={obj.id} obj={obj} mutate={fetchEntries} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay entradas de productos
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Cargando...
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TablePagination
                  sx={{ mt: 2, width: "100%" }}
                  rowsPerPage={limitEntries}
                  count={totalEntries}
                  page={pageEntries}
                  onPageChange={handleChangePageEntries}
                  onRowsPerPageChange={handleChangeRowsPerPageEntries}
                />
              </TableRow>
            </TableBody>
          </Table>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default EntryInvoice
