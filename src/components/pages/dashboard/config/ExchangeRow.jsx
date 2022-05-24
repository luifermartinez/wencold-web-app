import { Button, TableCell, TableRow } from "@mui/material"
import moment from "moment"
import EditIcon from "@mui/icons-material/Edit"

const ExchageRow = ({
  id,
  bsEquivalence,
  createdAt,
  updatedAt,
  handleEdit,
  editable,
}) => {
  return (
    <TableRow>
      <TableCell>{bsEquivalence.toFixed(2)} BsD</TableCell>
      <TableCell align="center">
        {moment(createdAt).format("DD/MM/YYYY h:mm A")}
      </TableCell>
      <TableCell align="center">
        {createdAt === updatedAt
          ? "-"
          : moment(updatedAt).format("DD/MM/YYYY h:mm A")}
      </TableCell>
      <TableCell align="center">
        {editable ? (
          <Button
            startIcon={<EditIcon />}
            variant="text"
            onClick={() => handleEdit({ id, bsEquivalence })}
          >
            Editar
          </Button>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  )
}

export default ExchageRow
