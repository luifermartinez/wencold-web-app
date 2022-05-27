import Page from "@/components/utils/Page"
import { LoadingButton } from "@mui/lab"
import {
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"
import ProductCard from "./ProductCard"

const Products = () => {
  const { setMessage } = useContext(AppContext)
  const [provSearch, setProvSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [products, setProducts] = useState([])
  const [productType, setProductType] = useState("")
  const [productTypes, setProductTypes] = useState([])
  const [lastExchange, setLastExchange] = useState(null)

  const fetchProductTypes = useCallback(() => {
    fetcherAuth(`/product/productTypes?page=1&limit=100000`)
      .then((res) => {
        setProductTypes(res.data)
      })
      .catch((error) => {
        setMessage({
          type: "error",
          message: error.message,
        })
      })
  }, [])

  const fetchLastExchange = useCallback(() => {
    fetcherAuth(`/exchange/last`)
      .then((res) => {
        setLastExchange(res.data.bsEquivalence)
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
  }, [])

  useEffect(() => {
    fetchLastExchange()
  }, [fetchLastExchange])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    fetcherAuth(
      `/product?page=${page}${search ? `&search=${search}` : ""}${
        productType ? `&productType=${productType}` : ""
      }`
    )
      .then((res) => {
        setProducts(res.data)
        setTotal(res.total)
      })
      .catch((error) => {
        setMessage({
          type: "error",
          message: error.message,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, search, productType])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchProductTypes()
  }, [fetchProductTypes])

  const handleChangePage = (event, value) => {
    setPage(value + 1)
  }

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(1)
  }

  return (
    <Page title="InverWencold | Productos">
      <Stack spacing={2}>
        <Card sx={{ mx: 1 }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  value={provSearch}
                  onChange={(e) => setProvSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setSearch(provSearch)
                      setPage(0)
                    }
                  }}
                  label="Buscar productos"
                />
                <LoadingButton
                  size="small"
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
                <InputLabel id="status">
                  Filtrar por tipo de producto
                </InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  value={productType}
                  label="Filtrar por tipo de producto"
                  onChange={(event) => setProductType(event.target.value)}
                >
                  {productTypes.map((productType) => (
                    <MenuItem key={productType.id} value={productType.id}>
                      {productType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
        <Stack spacing={2} alignItems="center">
          {search && <Stack spacing={2}>{total} RESULTADOS</Stack>}
          <Grid container justifyContent="center">
            {!loading ? (
              products.length > 0 ? (
                products.map((stock) => (
                  <Grid
                    item
                    key={stock.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{ p: 1 }}
                  >
                    <ProductCard stock={stock} lastExchange={lastExchange} />
                  </Grid>
                ))
              ) : (
                <Stack spacing={2} justifyContent="center" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    No hay productos para mostrar
                  </Typography>
                </Stack>
              )
            ) : (
              <Stack spacing={2} justifyContent="center" alignItems="center">
                <CircularProgress />
                <Typography variant="body1" color="textSecondary">
                  Cargando productos...
                </Typography>
              </Stack>
            )}
          </Grid>
          <TablePagination
            sx={{ border: 0 }}
            rowsPerPage={limit}
            count={total}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Productos por página"
          />
        </Stack>
      </Stack>
    </Page>
  )
}

export default Products
