import { Box, CircularProgress, Typography } from "@mui/material"

const LoadingPage = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h5" color="textSecondary">
        Cargando...
      </Typography>
    </Box>
  )
}

export default LoadingPage
