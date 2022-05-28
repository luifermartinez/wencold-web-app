import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import EditIcon from "@mui/icons-material/Edit"
import NumberFormat from "react-number-format"

const Taxes = () => {
  const { setMessage, user } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [tax, setTax] = useState(null)
  const { palette } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [newTax, setNewTax] = useState({
    tax: 0,
  })

  const fetchTax = useCallback(() => {
    setLoading(true)
    fetcherAuth("/tax")
      .then((res) => {
        setTax(res.data)
        setNewTax({
          tax: res.data.tax * 100,
        })
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTax()
  }, [fetchTax])

  const saveTax = () => {
    const value = newTax.tax / 100
    if (value === tax.tax) {
      setIsOpen(false)
      return
    }
    console.log(value)
    if (value > 1 || value < 0) {
      setMessage({ type: "error", text: "El valor debe estar entre 0 y 100" })
      return
    }
    fetcherAuth("/tax", { value: Number(newTax.tax / 100).toFixed(2) }, "PUT")
      .then((res) => {
        setMessage({ type: "success", text: res.message })
        setIsOpen(false)
        fetchTax()
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
  }

  return (
    <Card>
      <CardContent sx={{ overflowX: "auto" }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">
            Impuesto
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={6} lg={4}>
              <Box
                sx={{
                  border: 1,
                  borderRadius: 1,
                  p: 1,
                  borderColor: palette.divider,
                }}
              >
                {!loading ? (
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack>
                        <Typography variant="body2" color="textSecondary">
                          Nombre
                        </Typography>
                        <Typography variant="h6">{tax?.description}</Typography>
                      </Stack>
                      <Stack alignItems="end">
                        <Typography variant="body2" color="textSecondary">
                          Impuesto
                        </Typography>
                        <Typography variant="h6">{tax?.tax * 100}%</Typography>
                      </Stack>
                    </Stack>

                    {user.id === 1 && (
                      <>
                        <Collapse in={isOpen}>
                          <NumberFormat
                            value={newTax.tax}
                            decimalScale={2}
                            customInput={TextField}
                            fullWidth
                            label="Impuesto (%)"
                            size="small"
                            suffix=" %"
                            onValueChange={(values) =>
                              setNewTax({ ...newTax, tax: values.value })
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                saveTax()
                              }
                            }}
                          />
                        </Collapse>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => (isOpen ? saveTax() : setIsOpen(true))}
                        >
                          {isOpen ? "Guardar" : "Editar"}
                        </Button>
                      </>
                    )}
                  </Stack>
                ) : (
                  <Stack spacing={2} alignItems="center">
                    <CircularProgress />
                    <Typography variant="h6">Cargando...</Typography>
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
export default Taxes
