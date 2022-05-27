import { Button, Chip, TableCell, TableRow } from "@mui/material"
import NumberFormat from "react-number-format"
import EditIcon from "@mui/icons-material/Edit"
import { useNavigate } from "react-router-dom"

const PaymentMethodRow = ({ paymentMethod }) => {
  const navigate = useNavigate()

  return (
    <TableRow>
      <TableCell>{paymentMethod.name}</TableCell>
      <TableCell>
        {paymentMethod.ownerName ? paymentMethod.ownerName : "-"}
      </TableCell>
      <TableCell>{paymentMethod.dni ? paymentMethod.dni : "-"}</TableCell>
      <TableCell>{paymentMethod.email ? paymentMethod.email : "-"}</TableCell>
      <TableCell align="center">
        {paymentMethod.phoneNumber ? paymentMethod.phoneNumber : "-"}
      </TableCell>
      <TableCell align="center">
        {paymentMethod.bankName ? paymentMethod.bankName : "-"}
      </TableCell>
      <TableCell align="center">
        <NumberFormat
          displayType="text"
          value={paymentMethod.accountNumber}
          format="#### #### #### #### ####"
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          label={paymentMethod.deletedAt ? "Desactivado" : "Activo"}
          color={paymentMethod.deletedAt ? "warning" : "success"}
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
      </TableCell>
      <TableCell align="center">
        <Button
          startIcon={<EditIcon />}
          size="small"
          onClick={() => navigate(`payment-methods/${paymentMethod.id}`)}
        >
          Editar
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default PaymentMethodRow
