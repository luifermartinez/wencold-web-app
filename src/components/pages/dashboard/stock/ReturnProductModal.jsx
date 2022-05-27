import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ProductRow from "./entry/ProductRow"
import { useForm } from "react-hook-form"

const ReturnProductModal = ({
  isOpen,
  handleClose,
  selected,
  returnProduct,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      description: null,
    },
  })

  const returnP = (values) => {
    returnProduct(values.description)
    reset({
      description: "",
    })
    handleClose()
  }

  const product = selected
    ? {
        code: selected.product.code,
        name: selected.product.name,
        price: selected.product.price,
        quantity: selected.quantity,
        warrantyUpTo: selected.product.warrantyUpTo,
        provider: selected.product.provider,
        productType: selected.product.productType,
      }
    : null
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          marginTop: -10,
          border: "none",
          height: "100%",
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={7}>
            <Card component="form" onSubmit={handleSubmit(returnP)}>
              <CardContent sx={{ position: "relative" }}>
                <IconButton
                  onClick={handleClose}
                  sx={{ position: "absolute", right: 10, top: 10 }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h5" component="h2">
                  Devolucion de producto
                </Typography>
                <Stack spacing={2}>
                  {product && <ProductRow product={product} />}
                  <Typography variant="h6" component="h2" textAlign="center">
                    ¿Esta seguro que desea devolver este producto al proveedor?
                  </Typography>
                  <TextField
                    helperText={
                      errors.description && errors.description.message
                    }
                    color={errors.description ? "error" : "primary"}
                    label="Ingrese la razón de la devolución"
                    autoComplete="off"
                    error={errors.description}
                    {...register("description", {
                      required: {
                        value: true,
                        message: "La razón de la devolución es requerida",
                      },
                    })}
                  />
                  <Grid container>
                    <Grid item xs={12} md={6} paddingX={1} marginBottom={1}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={returnProduct}
                        type="submit"
                      >
                        Si
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6} paddingX={1} marginBottom={1}>
                      <Button variant="outlined" fullWidth>
                        No
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ReturnProductModal
