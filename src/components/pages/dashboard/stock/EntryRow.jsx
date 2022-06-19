import {
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material"
import moment from "moment"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useContext, useEffect, useState } from "react"
import UndoIcon from "@mui/icons-material/Undo"
import ReturnProductModal from "./ReturnProductModal"
import { fetcherAuth } from "@/helpers/fetch"
import { AppContext } from "@/context/AppContext"

const EntryRow = ({ obj, mutate }) => {
  const { setMessage } = useContext(AppContext)
  const { palette } = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [seeReason, setSeeReason] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!isOpen) {
      setSelected(null)
    }
  }, [isOpen])

  const returnProduct = (description) => {
    fetcherAuth(
      `/entry/${selected.id}`,
      {
        description,
      },
      "PUT"
    )
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
      .finally(() => handleClose())
  }

  return (
    <TableRow>
      <TableCell>{obj.code}</TableCell>
      <TableCell>
        <Grid container gap={0.5} sx={{ width: "100%" }}>
          {obj.entryInvoiceProduct.map((item) => {
            return (
              <Grid key={item.id} container>
                <Stack
                  sx={{
                    border: 1,
                    borderRadius: 1,
                    padding: 1,
                    width: "100%",
                    borderColor: palette.action.selected,
                  }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" whiteSpace="nowrap">
                    {item.quantity} | {item.product.code} | {item.product.name}
                  </Typography>
                  {!item.returnProduct ? (
                    <>
                      <IconButton size="small" onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={() => {
                            setIsOpen(true)
                            setSelected(item)
                            handleClose()
                          }}
                        >
                          <ListItemIcon>
                            <UndoIcon />
                          </ListItemIcon>
                          <ListItemText>Realizar devolución</ListItemText>
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Producto devuelto
                      {item.returnProduct.description ? (
                        <Typography variant="body2" color="textSecondary">
                          {" "}
                          - {item.returnProduct.description}
                        </Typography>
                      ) : null}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            )
          })}
        </Grid>
      </TableCell>
      <TableCell>
        <Grid container gap={0.5} sx={{ width: "100%" }}>
          {obj.entryInvoiceProduct.map((item, i) => {
            return (
              <Grid
                key={item.id}
                container
                gap={1}
                sx={{
                  borderTop: i > 0 ? 1 : 0,
                  borderTopColor: palette.primary.light,
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="body2">
                    {item.product.provider.people.dni}
                  </Typography>
                  <Typography variant="body2">
                    {item.product.provider.people.firstname}{" "}
                    {item.product.provider.people.lastname}
                  </Typography>
                </Stack>
              </Grid>
            )
          })}
        </Grid>
      </TableCell>
      <TableCell align="center">
        {moment(obj.createdAt).format("DD/M/YY hh:mm A")}
      </TableCell>
      <ReturnProductModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        selected={selected}
        returnProduct={returnProduct}
      />
    </TableRow>
  )
}

export default EntryRow
