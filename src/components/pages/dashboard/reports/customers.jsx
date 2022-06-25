import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import GroupIcon from "@mui/icons-material/Group"
import { AppContext } from "@/context/AppContext"
import { useReactToPrint } from "react-to-print"
import moment from "moment"
import { fetcherAuth } from "@/helpers/fetch"
import Logo from "@/components/common/Logo"

const CustomerRegistered = () => {
  const { setMessage, mode, setMode } = useContext(AppContext)
  const [data, setData] = useState([])
  const [printing, setPrinting] = useState(false)
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)
  const [steps, setSteps] = useState(0)
  const ref = useRef()
  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => {
      if (mode === "dark") {
        setMode("dark")
      }
      setPrinting(false)
    },
  })

  const setWeekDate = () => {
    setStartDate(moment().startOf("isoWeek").format("YYYY-MM-DD"))
    setEndDate(moment().endOf("isoWeek").format("YYYY-MM-DD"))
  }

  const setMonthDate = () => {
    setStartDate(moment().startOf("month").format("YYYY-MM-DD"))
    setEndDate(moment().endOf("month").format("YYYY-MM-DD"))
  }

  const setYearDate = () => {
    setStartDate(moment().startOf("year").format("YYYY-MM-DD"))
    setEndDate(moment().endOf("year").format("YYYY-MM-DD"))
  }

  const setAllDate = () => {
    setStartDate("")
    setEndDate("")
  }

  const fetchData = useCallback(() => {
    fetcherAuth(
      `/users/customers-registered${
        startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ""
      }`
    )
      .then((res) => {
        if (res.data.length === 0) {
          setMessage({
            type: "error",
            text: "No hay produtos para mostrar para esta fecha",
          })
          return
        }
        setData(res.data)
        setSteps(Math.ceil(res.data.length / 10))
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
  }, [startDate, endDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Clientes registrados</Typography>
          <Grid container gap={2}>
            <Grid item xs={12} sm={12} md lg>
              <TextField
                size="small"
                fullWidth
                type="date"
                label="Fecha de inicio"
                value={startDate}
                onChange={(event) => {
                  if (endDate && event.target.value > endDate) {
                    setMessage({
                      type: "error",
                      text: "La fecha de inicio no puede ser mayor a la fecha final",
                    })
                    return
                  }
                  setStartDate(event.target.value)
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md lg>
              <TextField
                size="small"
                fullWidth
                type="date"
                label="Fecha de fin"
                value={endDate}
                onChange={(event) => {
                  if (new Date(event.target.value) >= new Date(startDate)) {
                    setEndDate(event.target.value)
                  } else {
                    setMessage({
                      type: "error",
                      text: "La fecha de fin no puede ser menor a la fecha de inicio",
                    })
                  }
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item container xs={12} gap={2}>
              <Grid item xs={12} sm={12} lg>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  fullWidth
                  onClick={setWeekDate}
                >
                  De la semana
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} lg>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  fullWidth
                  onClick={setMonthDate}
                >
                  Del mes
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} lg>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  fullWidth
                  onClick={setYearDate}
                >
                  Del año
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} lg>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  fullWidth
                  onClick={setAllDate}
                >
                  Siempre
                </Button>
              </Grid>
              {data.length > 0 && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="small"
                    onClick={() => {
                      setPrinting(true)
                      if (mode === "dark") {
                        setMode("light")
                      }
                      new Promise((resolve) => resolve()).then(() => {
                        handlePrint()
                      })
                    }}
                  >
                    Imprimir
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
          {printing && steps > 0 && (
            <div ref={ref}>
              {Array.from({ length: steps }).map((_, i) => (
                <Stack
                  key={i}
                  spacing={2}
                  ref={ref}
                  sx={{ margin: 3, pageBreakAfter: "always" }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Stack spacing={2}>
                      <Logo size="h5" />
                      <Typography variant="body2" color="text-secondary">
                        RIF: J-299008605
                      </Typography>
                      <Typography variant="h6">
                        Clientes nuevos registrados
                      </Typography>
                    </Stack>
                    <Stack spacing={2} alignItems="flex-end">
                      {startDate && endDate && (
                        <>
                          <Typography variant="body1">
                            Desde: {moment(startDate).format('DD/MM/YYYY')}
                          </Typography>
                          <Typography variant="body1">
                            Hasta: {moment(endDate).format('DD/MM/YYYY')}
                          </Typography>
                        </>
                      )}
                      <Typography variant="body2">
                        Fecha de generación: {moment().format("DD/MM/YYYY")}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box style={{ mt: "200px" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>DNI</TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Correo electrónico</TableCell>
                          <TableCell align="center">
                            Fecha de registro
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.slice(i * 10, i * 10 + 10).map((row, j) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.people.dni}</TableCell>
                            <TableCell>
                              {row.people.firstname} {row.people.lastname}
                            </TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell align="center">
                              {moment(row.createdAt).format("DD/MM/YYYY")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                  <Stack spacing={2}>
                    <Typography variant="body1">
                      Página {i + 1} de {steps}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

const Customers = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setIsOpen(!isOpen)}
        startIcon={<GroupIcon />}
      >
        Clientes
      </Button>
      <Collapse in={isOpen}>
        <Stack spacing={2}>
          <CustomerRegistered />
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default Customers
