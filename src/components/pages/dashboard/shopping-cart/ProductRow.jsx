import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { memo, useCallback, useContext, useEffect, useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"

const ProductRow = ({ cart, lastExchange, mutate }) => {
  const { shape } = useTheme()
  const { setMessage } = useContext(AppContext)
  const [stock, setStock] = useState(null)
  const [quantity, setQuantity] = useState(cart.quantity)
  const [oldQuantity] = useState(cart.quantity)
  const image =
    cart.product.productImage.length > 0
      ? `${import.meta.env.VITE_BACKEND_API}/image?imagePath=${
          cart.product.productImage[0].image.path
        }`
      : `${
          import.meta.env.VITE_BACKEND_API
        }/image?imagePath=default/default-product.png`

  const fetchStock = useCallback(() => {
    fetcherAuth(`/stock/product/${cart.product.id}`)
      .then((res) => setStock(res.data))
      .catch((error) => setMessage({ type: "error", message: error.message }))
  }, [])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  const changeQuantity = (value) =>
    fetcherAuth(
      `/shopping-cart/${cart.id}`,
      {
        quantity: value,
      },
      "PUT"
    )
      .then((res) => {
        setMessage({
          type: "success",
          text: "Cantidad actualizada correctamente",
        })
        setQuantity(value)
        mutate()
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
        setQuantity(oldQuantity)
      })

  const removeProduct = () => {
    fetcherAuth(`/shopping-cart/${cart.id}`, null, "DELETE")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        mutate()
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs>
                <Box sx={{ height: 150, width: 150 }}>
                  <img
                    src={image}
                    alt="product image"
                    width={150}
                    height={150}
                    style={{
                      objectFit: "cover",
                      borderRadius: shape.borderRadius,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ height: "100%" }}
                >
                  <Stack>
                    <Typography variant="body2" color="textSecondary">
                      Nombre del producto
                    </Typography>
                    <Typography variant="body1">{cart.product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tipo de producto
                    </Typography>
                    <Typography variant="body1">
                      {cart.product.productType.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1">
                      {cart.product.productType.description}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="start">
                    <Stack
                      justifyContent={"space-between"}
                      sx={{ height: "100%" }}
                    >
                      <Stack alignItems="end">
                        <Typography variant="body2" color="textSecondary">
                          Precio
                        </Typography>
                        <Typography variant="body1">
                          {Number(cart.product.price * cart.quantity).toFixed(
                            2
                          )}{" "}
                          $
                        </Typography>
                        {lastExchange && (
                          <Typography variant="body1">
                            {Number(
                              cart.product.price * cart.quantity * lastExchange
                            ).toFixed(2)}{" "}
                            BsD
                          </Typography>
                        )}
                      </Stack>
                      <Stack spacing={1}>
                        {stock && (
                          <FormControl
                            variant="outlined"
                            fullWidth
                            size="small"
                          >
                            <InputLabel id="quantity">Cant</InputLabel>
                            <Select
                              labelId="quantity"
                              label="Cant"
                              value={quantity}
                              onChange={(e) => changeQuantity(e.target.value)}
                            >
                              {Array.from({ length: stock.available }).map(
                                (val, i) => (
                                  <MenuItem key={i} value={i + 1}>
                                    {i + 1}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        )}
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={removeProduct}
                          variant="outlined"
                        >
                          Eliminar producto
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default memo(ProductRow)
