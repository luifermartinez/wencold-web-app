import { AppContext } from "@/context/AppContext"
import Router from "@/routers/Router"
import { Alert, Snackbar } from "@mui/material"
import { useContext, useEffect, useState } from "react"

const Layout = () => {
  const { message } = useContext(AppContext)
  const [open, setOpen] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  useEffect(() => {
    if (message.text) {
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
      }, 6000)
    }
  }, [message])

  return (
    <>
      <Router />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={message.type}
          elevation={6}
          variant='filled'
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Layout
