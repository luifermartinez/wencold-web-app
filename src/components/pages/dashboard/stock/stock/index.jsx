import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"
import {
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
import StockRow from "./StockRow"
import SearchIcon from "@mui/icons-material/Search"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"

const Inventory = () => {
  const { setMessage } = useContext(AppContext)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [provSearch, setProvSearch] = useState("")
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({
    column: "",
    type: true,
  })

  const fetchStock = useCallback(() => {
    setLoading(true)
    fetcherAuth(
      `/stock?page=${page + 1}&limit=${limit} ${
        search ? `&search=${search}` : ""
      } ${sort.column ? `&sort=${sort.column}&type=${sort.type ? 1 : 0}` : ""}`
    )
      .then((res) => {
        setInventory(res.data)
        setTotal(res.total)
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: err.message,
        })
      })
      .finally(() => setLoading(false))
  }, [page, limit, search, sort])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

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
          <Typography variant="h5" component="h2">
            Inventario de productos
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              label="Buscar producto, codigo, proveedor, tipo de producto..."
              variant="outlined"
              size="small"
              autoComplete="off"
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
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSort({ column: "stock.id", type: !sort.type })
                  }
                >
                  <Stack direction="row" alignItems={1} spacing={1}>
                    <Typography>ID</Typography>
                    {sort.column === "stock.id" && sort.type && (
                      <ArrowUpwardIcon />
                    )}
                    {sort.column === "stock.id" && !sort.type && (
                      <ArrowDownwardIcon />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSort({ column: "product.code", type: !sort.type })
                  }
                >
                  <Stack
                    direction="row"
                    alignItems={1}
                    spacing={1}
                    justifyContent="end"
                  >
                    <Typography>Codigo</Typography>
                    {sort.column === "product.code" && sort.type && (
                      <ArrowUpwardIcon />
                    )}
                    {sort.column === "product.code" && !sort.type && (
                      <ArrowDownwardIcon />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSort({ column: "product.name", type: !sort.type })
                  }
                >
                  <Stack direction="row" alignItems={1} spacing={1}>
                    <Typography>Producto</Typography>
                    {sort.column === "product.name" && sort.type && (
                      <ArrowUpwardIcon />
                    )}
                    {sort.column === "product.name" && !sort.type && (
                      <ArrowDownwardIcon />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSort({ column: "product.price", type: !sort.type })
                  }
                >
                  <Stack direction="row" alignItems={1} spacing={1}>
                    <Typography>Precio</Typography>
                    {sort.column === "product.price" && sort.type && (
                      <ArrowUpwardIcon />
                    )}
                    {sort.column === "product.price" && !sort.type && (
                      <ArrowDownwardIcon />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSort({ column: "productType.name", type: !sort.type })
                  }
                >
                  <Stack direction="row" alignItems={1} spacing={1}>
                    <Typography>Tipo</Typography>
                    {sort.column === "productType.name" && sort.type && (
                      <ArrowUpwardIcon />
                    )}
                    {sort.column === "productType.name" && !sort.type && (
                      <ArrowDownwardIcon />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSort({ column: "stock.existence", type: !sort.type })
                  }
                >
                  <Stack
                    direction="row"
                    alignItems={1}
                    spacing={1}
                    justifyContent="center"
                  >
                    <Typography>Existencia</Typography>
                    {sort.column === "stock.existence" && sort.type && (
                      <ArrowUpwardIcon />
                    )}
                    {sort.column === "stock.existence" && !sort.type && (
                      <ArrowDownwardIcon />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSort({ column: "stock.available", type: !sort.type })
                  }
                >
                  <Stack
                    direction="row"
                    alignItems={1}
                    spacing={1}
                    justifyContent="center"
                  >
                    <Typography>Disponible</Typography>
                    {sort.column === "stock.available" && sort.type && (
                      <ArrowUpwardIcon />
                    )}
                    {sort.column === "stock.available" && !sort.type && (
                      <ArrowDownwardIcon />
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                inventory.length > 0 ? (
                  inventory.map((obj) => <StockRow key={obj.id} stock={obj} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay entradas de productos
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Cargando...
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TablePagination
                  sx={{ mt: 2, width: "100%" }}
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

export default Inventory
