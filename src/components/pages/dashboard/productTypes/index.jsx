import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
import CategoryIcon from "@mui/icons-material/Category"
import { LoadingButton } from "@mui/lab"
import SearchIcon from "@mui/icons-material/Search"
import moment from "moment"
import EditIcon from "@mui/icons-material/Edit"
import CreateProductType from "../stock/CreateProductType"

const ProductTypes = () => {
  const { setMessage } = useContext(AppContext)
  const [productTypes, setProductTypes] = useState([])
  const [loadingPT, setLoadingPT] = useState(false)
  const [pagePT, setPagePT] = useState(0)
  const [limitPT, setLimitPT] = useState(10)
  const [provSearchPT, setProvSearchPT] = useState("")
  const [totalPT, setTotalPT] = useState(0)
  const [searchPT, setSearchPT] = useState("")
  const [selectedPT, setSelectedPT] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)

  const fetchProductTypes = useCallback(() => {
    setLoadingPT(true)
    fetcherAuth(
      `/product/productTypes?page=${pagePT + 1}&limit=${limitPT}${
        searchPT ? `&search=${searchPT}` : ""
      }`
    )
      .then((res) => {
        setProductTypes(res.data)
        setTotalPT(res.total)
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
      .finally(() => {
        setLoadingPT(false)
      })
  }, [pagePT, limitPT, searchPT])

  useEffect(() => {
    fetchProductTypes()
  }, [fetchProductTypes])

  useEffect(() => {
    if (provSearchPT === "") setSearchPT("")
  }, [provSearchPT])

  const handleChangePagePT = (event, value) => {
    setPagePT(value)
  }

  const handleChangeRowsPerPagePT = (event) => {
    setLimitPT(parseInt(event.target.value, 10))
    setPagePT(0)
  }

  const handleEdit = (obj) => {
    setSelectedPT(obj)
    handleOpen()
  }

  return (
    <Page title="InverWencold | Tipos de productos">
      <Banner
        title="Tipos de productos"
        description="Tipos de productos, en este módulo podrás gestionar todos los tipos de productos."
      />
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ overflowX: "auto" }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" component="h2">
              Tipos de producto
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<CategoryIcon />}
              onClick={handleOpen}
            >
              Agregar tipo de producto
            </Button>
          </Stack>
          <Stack marginY={2}>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Buscar tipos de productos"
                variant="outlined"
                fullWidth
                size="small"
                value={provSearchPT}
                onChange={(e) => setProvSearchPT(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearchPT(provSearchPT)
                    setPagePT(0)
                  }
                }}
              />
              <LoadingButton
                loading={loadingPT}
                disabled={loadingPT}
                variant="outlined"
                size="small"
                startIcon={<SearchIcon />}
                onClick={() => {
                  if (provSearchPT) {
                    setSearchPT(provSearchPT)
                    setPagePT(0)
                  }
                }}
              >
                Buscar
              </LoadingButton>
            </Stack>
          </Stack>
          <Table sx={{ borderRadius: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Fecha de creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loadingPT ? (
                productTypes.length > 0 ? (
                  productTypes.map((productType) => (
                    <TableRow key={productType.id}>
                      <TableCell>{productType.name}</TableCell>
                      <TableCell>{productType.description}</TableCell>
                      <TableCell>
                        {moment(productType.createdAt).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(productType)}
                          size="small"
                          variant="contained"
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
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
                          No hay tipos de productos para mostrar
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
                        Cargando tipos de productos
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TablePagination
                  sx={{ mt: 2, width: "100%" }}
                  rowsPerPage={limitPT}
                  count={totalPT}
                  page={pagePT}
                  onPageChange={handleChangePagePT}
                  onRowsPerPageChange={handleChangeRowsPerPagePT}
                />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateProductType
        isOpen={isOpen}
        handleClose={handleClose}
        selected={selectedPT}
        mutate={fetchProductTypes}
      />
    </Page>
  )
}

export default ProductTypes
