import { createTheme, ThemeProvider } from "@mui/material/styles"
import Layout from "@/layouts/Layout"
import { CssBaseline } from "@mui/material"

import { HelmetProvider } from "react-helmet-async"
import { esES } from "@mui/material/locale"
import "./App.css"
import { useGetApp } from "./helpers/hooks"

function App() {
  const { mode } = useGetApp()

  const theme = createTheme(
    {
      palette: {
        mode,
        secondary: {
          main: "#558ABB",
        },
        background:
          mode === "dark"
            ? {
                default: "#0a1929",
                paper: "#001e3c",
              }
            : {
                default: "#fafafa",
                paper: "#fff",
              },
      },
    },
    esES
  )

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout />
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
