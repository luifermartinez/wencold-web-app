import { Button, TableCell, TableRow } from "@mui/material"
import { useNavigate } from "react-router-dom"
import EditIcon from "@mui/icons-material/Edit"
import NumberFormat from "react-number-format"

const StockRow = ({ stock }) => {
  const navigate = useNavigate()

  return (
    <TableRow>
      <TableCell>{stock.id}</TableCell>
      <TableCell align="right">{stock.product.code}</TableCell>
      <TableCell>{stock.product.name}</TableCell>
      <TableCell><NumberFormat displayType="text" value={stock.product.price} thousandSeparator decimalScale={2} fixedDecimalScale suffix=" $" /></TableCell>
      <TableCell>{stock.product.productType.name}</TableCell>
      <TableCell align="center">{stock.existence}</TableCell>
      <TableCell align="center">{stock.available}</TableCell>
      <TableCell align="center">
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/dashboard/stock/${stock.product.id}`)}
        >
          Editar
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default StockRow
