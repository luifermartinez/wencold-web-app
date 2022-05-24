import Page from "@/components/utils/Page"
import { Box, Button, Typography } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Page title="InverWencold | Página no encontrada">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "calc(100vh - 300px)",
        }}
      >
        <ClearIcon sx={{ width: 80, height: 80 }} />
        <Typography variant="h2" marginY={3} textAlign="center">
          Página no encontrada
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Volver a la página principal
        </Button>
      </Box>
    </Page>
  )
}

export default NotFound
