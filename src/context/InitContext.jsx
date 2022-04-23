import { useEffect, useState } from "react"
import { AppContext } from "@/context/AppContext"

const InitContext = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light")

  const value = {
    mode,
    setMode,
  }

  useEffect(() => {
    localStorage.setItem("mode", mode)
  }, [mode])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default InitContext
