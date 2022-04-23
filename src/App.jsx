import { createTheme, ThemeProvider } from "@mui/material/styles"
import Layout from "@/layouts/Layout"
import { CssBaseline } from "@mui/material"
import { useContext } from "react"
import { AppContext } from "@/context/AppContext"
import { HelmetProvider } from "react-helmet-async"

function App() {
  const { mode } = useContext(AppContext)

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#BA69FF",
      },
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
    }
  })

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
