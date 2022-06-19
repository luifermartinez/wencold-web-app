import Router from "@/routers/Router"
import { useTheme } from "@mui/material"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Layout = () => {
  const { palette } = useTheme()

  return (
    <>
      <Router />
      <ToastContainer
        position="bottom-left"
        toastStyle={{
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          border: "1px solid " + palette.divider,
        }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </>
  )
}

export default Layout
