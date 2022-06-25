import Logo from "@/components/common/Logo"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Box,
  Button,
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
import moment from "moment"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

const Bitacora = () => {
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

  const fetchMovements = useCallback(() => {
    if (startDate && endDate) {
      if (moment(endDate).isBefore(startDate)) {
        return setMessage({
          type: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
        })
      }
    }
    fetcherAuth(
      `/movements?page=1&limit=999999999${
        startDate && endDate
          ? `&startDate=${moment(startDate)
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss")}&dateEnd=${moment(endDate)
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")}`
          : ""
      }`
    )
      .then((res) => {
        setData(res.data)
        setSteps(Math.ceil(res.data.length / 10))
      })
      .catch((error) => {
        setMessage({ type: "error", text: error.message })
      })
  }, [startDate, endDate])

  useEffect(() => {
    fetchMovements()
  }, [fetchMovements])

  const [isOpen, setIsOpen] = useState(false)
  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setIsOpen(!isOpen)}
      >
        Bitácora
      </Button>
      <Collapse in={isOpen}>
        <Stack spacing={2}>
          <Typography variant="h6">Bitácora</Typography>
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
                        Reporte de Bitácora
                      </Typography>
                    </Stack>
                    <Stack spacing={2} alignItems="flex-end">
                      {startDate && endDate && (
                        <>
                          <Typography variant="body1">
                            Desde: {moment(startDate).format("DD/MM/YYYY")}
                          </Typography>
                          <Typography variant="body1">
                            Hasta: {moment(endDate).format("DD/MM/YYYY")}
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
                          <TableCell>Usuario</TableCell>
                          <TableCell>Descripción de acción</TableCell>
                          <TableCell align="center">Fecha</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.slice(i * 10, i * 10 + 10).map((row, j) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              {row.user?.email} {row.user?.people.firstname}{" "}
                              {row.user?.people.lastname}
                            </TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell align="center">
                              {moment(row.movementDate).format(
                                "DD/MM/YYYY HH:mm A"
                              )}
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
      </Collapse>
    </Stack>
  )
}

export default Bitacora
