import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import { CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"

const ShoppingCart = () => {
  const { setMessage } = useContext(AppContext)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(() => {
    setLoading(true)
    fetcherAuth(`/shopping-cart`)
      .then((res) => {
        setProducts(res.data)
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
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return (
    <Page title="InverWencold | Mi carrito de compras">
      <Banner
        title="Mi carrito de compras"
        description="Productos guardados."
      />

      <Stack spacing={2} alignItems="center">
        {!loading ? (
          products.length > 0 ? (
            products.map((product) => (
              <Grid container key={product.id}>
                {JSON.stringify(product)}
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No hay productos en el carrito.
            </Typography>
          )
        ) : (
          <Stack alignItems={"center"} spacing={2}>
            <CircularProgress />
            <Typography variant="body1" color="textSecondary">
              Cargando...
            </Typography>
          </Stack>
        )}
      </Stack>
    </Page>
  )
}

export default ShoppingCart
