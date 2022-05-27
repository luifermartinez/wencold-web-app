import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import NumberFormat from "react-number-format"
import moment from "moment"

const ProductRow = ({ product, getValues, setValue, index }) => {
  const { palette } = useTheme()

  return (
    <Grid item xs={12} marginTop={2} paddingX={1}>
      <Stack
        direction="row"
        position="relative"
        sx={{
          border: 1,
          borderRadius: 1,
          borderColor: palette.primary.main,
        }}
      >
        <Box width={"100%"} sx={{ p: 2 }}>
          <Grid container width="100%">
            <Grid xs={12} sm={6} md={3} lg={3}>
              <Stack>
                <Typography variant="body2" color="textSecondary">
                  Código
                </Typography>
                <Typography
                  variant="body"
                  color="textPrimary"
                  fontWeight={"bold"}
                >
                  {product.code}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Nombre del producto
                </Typography>
                <Typography
                  variant="body"
                  color="textPrimary"
                  fontWeight={"bold"}
                >
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Precio
                </Typography>
                <Typography
                  variant="body"
                  color="textPrimary"
                  fontWeight={"bold"}
                >
                  <NumberFormat
                    customInput={Typography}
                    displayType="text"
                    value={product.price}
                    suffix=" $"
                  />
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={12} sm={6} md={3} lg={3}>
              <Stack>
                <Typography variant="body2" color="textSecondary">
                  Cantidad
                </Typography>
                <Typography
                  variant="body"
                  color="textPrimary"
                  fontWeight={"bold"}
                >
                  {product.quantity}
                </Typography>
                {product.warrantyUpTo && (
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Fecha de vencimiento
                    </Typography>
                    <Typography
                      variant="body"
                      color="textPrimary"
                      fontWeight={"bold"}
                    >
                      {moment(product.warrantyUpTo).format("DD/MM/YYYY")}
                    </Typography>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid xs={12} sm={6} md={3} lg={3}>
              <Stack>
                <Typography variant="body2" color="textSecondary">
                  Proveedor
                </Typography>
                <Typography
                  variant="body"
                  color="textPrimary"
                  fontWeight={"bold"}
                >
                  {product.provider?.people?.dni}
                  {" | "}
                  {product.provider?.people?.firstname}{" "}
                  {product.provider?.people?.lastname}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tipo de producto
                </Typography>
                <Typography
                  variant="body"
                  color="textPrimary"
                  fontWeight={"bold"}
                >
                  {product.productType?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Descripción
                </Typography>
                <Typography
                  variant="body"
                  color="textPrimary"
                  fontWeight={"bold"}
                >
                  {product.productType?.description}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        {setValue && getValues && (
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5 }}
            onClick={() => {
              const arr = getValues("products")
              arr.splice(index, 1)
              setValue("products", arr)
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    </Grid>
  )
}

export default ProductRow
