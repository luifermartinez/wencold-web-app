import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { Alert, Stack } from "@mui/material"
import Customers from "./customers"
import Products from "./products"
import Sales from "./sales"

const Reports = () => {
  return (
    <Page title="InverWencold | Reportes">
      <Banner
        title="Reportes"
        description="Módulo de reportes de la aplicación."
      />
      <Stack spacing={2}>
        <Alert variant="outlined" severity="info">
          Si quiere que el reporte abarque un rango de fechas, seleccione la
          fecha de inicio y la fecha de fin.
        </Alert>
        <Sales />
        <Products />
        <Customers />
      </Stack>
    </Page>
  )
}

export default Reports
