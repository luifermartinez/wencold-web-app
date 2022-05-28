import orderStatus from "@/constants/orderStatus"
import {
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import ReceiptIcon from "@mui/icons-material/Receipt"
import { useNavigate } from "react-router-dom"
import moment from "moment"

const OrderRow = ({ order, lastExchange, tax }) => {
  const theme = useTheme()
  const { palette } = theme
  const navigate = useNavigate()

  const xs = useMediaQuery(theme.breakpoints.between("xs", "sm"))

  return (
    <Grid
      container
      key={order.id}
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: palette.divider,
        p: 2,
        boxShadow: 1,
      }}
      direction="row"
      justifyContent="space-between"
      gap={2}
    >
      <Grid item xs>
        <Stack
          direction="row"
          spacing={2}
          justifyContent={xs ? "space-between" : "start"}
        >
          <Stack>
            <Typography variant="body2" color="textSecondary">
              Orden
            </Typography>
            <Typography variant="body1">{order.code}</Typography>
            <Typography variant="body2" color="textSecondary">
              Productos
            </Typography>
            <Typography variant="body1">
              {order.billOutProducts.map(({ product, id, quantity }) => (
                <Stack key={id}>
                  <Typography variant="body2">
                    {quantity} - {product.name}
                  </Typography>
                </Stack>
              ))}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="body2" color="textSecondary">
              Fecha
            </Typography>
            <Typography variant="body1">
              {moment(order.createdAt).format("DD/MM/YYYY HH:mm A")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Estado
            </Typography>
            <Typography variant="body1">
              <Chip
                label={orderStatus[order.status]}
                sx={{ borderRadius: 1 }}
                variant="outlined"
                color={
                  order.status === "pending"
                    ? "warning"
                    : order.status === "refused"
                    ? "error"
                    : "primary"
                }
              />
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={2} justifyContent="center">
        <Button
          fullWidth
          variant="outlined"
          size="small"
          startIcon={<ReceiptIcon />}
          onClick={() => navigate(`${order.id}`)}
        >
          Ver detalles
        </Button>
      </Grid>
    </Grid>
  )
}

export default OrderRow
