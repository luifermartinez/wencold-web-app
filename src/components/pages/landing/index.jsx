import Page from "@/components/utils/Page"
import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import fiesta from "@/assets/img/fiesta.jpg"
import fiestaDia from "@/assets/img/fiesta-dia.jpg"
import { useContext } from "react"
import { AppContext } from "@/context/AppContext"
import { useNavigate } from "react-router-dom"

const createUrl = (url) => {
  return `url(${url})`
}

const Landing = () => {
  const { mode } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <Page title="InverWencold | Landing">
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h3" fontWeight="bold" fontFamily="Bebas Neue" letterSpacing={1}>
                Los mejores equipos de Refrigeración
              </Typography>
              <Typography variant="body1">
                Aquí en InverWencold encuentras los mejores equipos centrados en la refrigeración y derivados, registrate y empieza a comprar.
              </Typography>
              <Button variant="contained" color="primary" size="large" onClick={()=>navigate('/auth/signin')}>
                Ir al registro
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Page>
  )
}

export default Landing
