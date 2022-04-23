import Page from "@/components/utils/Page"
import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import fiesta from "@/assets/img/fiesta.jpg"
import fiestaDia from "@/assets/img/fiesta-dia.jpg"
import { useContext } from "react"
import { AppContext } from "@/context/AppContext"

const createUrl = (url) => {
  return `url(${url})`
}

const Landing = () => {
  const { mode } = useContext(AppContext)

  return (
    <Page title="appart.dev | Landing">
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h3" fontWeight="bold">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </Typography>
              <Typography variant="body1">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using Content
                here, content here, making it look like readable English. Many
                desktop publishing packages and web page editors now use Lorem
                Ipsum as their default model text, and a search for lorem ipsum
                will uncover many web sites still in their infancy. Various
                versions have evolved over the years, sometimes by accident,
                sometimes on purpose (injected humour and the like).
              </Typography>
              <Button variant="contained" color="primary" size="large">
                Primary
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundImage: createUrl(
                  mode === "dark" ? fiesta : fiestaDia
                ),
                backgroundRepeat: "no-repeat",
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Page>
  )
}

export default Landing
