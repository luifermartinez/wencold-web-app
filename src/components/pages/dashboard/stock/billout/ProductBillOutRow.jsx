import {
  Alert,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { useState } from "react"
import Lightbox from "react-image-lightbox"
import AddIcon from "@mui/icons-material/Add"

const ProductBillOutRow = ({
  product,
  lastExchange,
  handleAddProduct,
  selectedProducts,
}) => {
  const { palette, shape } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(product.available > 0 ? 1 : 0)
  const image =
    product.product.productImage.length > 0
      ? `${import.meta.env.VITE_BACKEND_API}/image?imagePath=${
          product.product.productImage[0].image.path
        }`
      : `${
          import.meta.env.VITE_BACKEND_API
        }/image?imagePath=default/default-product.png`
  return (
    <Box
      key={product.id}
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: palette.divider,
        p: 2,
        boxShadow: 1,
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box
          sx={{
            width: 150,
            height: 150,
          }}
        >
          <img
            src={image}
            alt="product image"
            width={150}
            height={150}
            style={{
              objectFit: "cover",
              borderRadius: shape.borderRadius,
              cursor: "pointer",
            }}
            onClick={() => setIsOpen(true)}
          />
          {isOpen && (
            <Lightbox mainSrc={image} onCloseRequest={() => setIsOpen(false)} />
          )}
        </Box>
        <Stack direction="row" sx={{ height: "100%", flex: 1 }}>
          <Stack>
            <Typography variant="body2" color="textSecondary">
              Código
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {product.product.code}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Nombre del producto
            </Typography>
            <Typography variant="body1">{product.product.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Tipo de producto
            </Typography>
            <Typography variant="body1">
              {product.product.productType.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Descripción
            </Typography>
            <Typography variant="body1">
              {product.product.productType.description}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="start" flex={1}>
            <Stack
              justifyContent={"space-between"}
              flex={1}
              sx={{ height: "100%" }}
            >
              <Stack alignItems="end">
                <Typography variant="body2" color="textSecondary">
                  Precio
                </Typography>
                <Typography variant="body1">
                  {Number(product.product.price).toFixed(2)} $
                </Typography>
                {lastExchange && (
                  <Typography variant="body1">
                    {Number(product.product.price * lastExchange).toFixed(2)}{" "}
                    BsD
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  Disponible
                </Typography>
                <Typography variant="body1">{product.available}</Typography>
              </Stack>
              {product.available > 0 ? (
                !selectedProducts.find((p) => p.product.id === product.id) ? (
                  <Stack direction="row" justifyContent="flex-end">
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ width: 200 }}
                    >
                      <InputLabel id="quantity">Disponible</InputLabel>
                      <Select
                        labelId="quantity"
                        label="Disponible"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      >
                        {Array.from({ length: product.available }).map(
                          (val, i) => (
                            <MenuItem key={i} value={i + 1}>
                              {i + 1}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                    <IconButton
                      sx={{
                        border: 0.2,
                        borderRadius: 1,
                        borderColor: palette.divider,
                      }}
                      onClick={() => {
                        handleAddProduct(product, quantity)
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                ) : (
                  <Stack direction="row" justifyContent="flex-end">
                    <Alert variant="outlined" color="success">
                      Producto agregado
                    </Alert>
                  </Stack>
                )
              ) : (
                <Stack direction="row" justifyContent="flex-end">
                  <Typography variant="body1">Sin stock</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ProductBillOutRow
