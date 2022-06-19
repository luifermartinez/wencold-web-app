import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import { CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import ProductRow from "./ProductRow"
import PaidIcon from "@mui/icons-material/Paid"
import { useNavigate } from "react-router-dom"
import { LoadingButton } from "@mui/lab"

const ShoppingCart = () => {
  const navigate = useNavigate()
  const { setMessage } = useContext(AppContext)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastExchange, setLastExchange] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  const makeOrder = () => {
    setSubmitting(true)
    fetcherAuth(`/payment/billOut`, {}, "POST")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        navigate("/dashboard/my-orders")
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Page title="InverWencold | Mi carrito de compras">
      <Banner
        title="Mi carrito de compras"
        description="Productos guardados."
      />

      <Stack spacing={2} alignItems="center">
        {!loading ? (
          products.length > 0 ? (
            products.map((cart) => (
              <ProductRow
                key={cart.id}
                cart={cart}
                lastExchange={lastExchange}
                mutate={fetchCart}
              />
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
        {products.length > 0 && (
          <LoadingButton
            loading={submitting}
            disabled={submitting}
            variant="contained"
            size="large"
            fullWidth
            startIcon={<PaidIcon />}
            onClick={makeOrder}
          >
            Realizar orden
          </LoadingButton>
        )}
      </Stack>
    </Page>
  )
}

export default ShoppingCart
