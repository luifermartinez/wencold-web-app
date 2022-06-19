import { useEffect, useState } from "react"
import { AppContext } from "@/context/AppContext"
import useToast from "@/components/utils/useToast"

const InitContext = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light")
  const [user, setUser] = useState({
    createdAt: "",
    email: "",
    expiresToken: null,
    id: null,
    image: null,
    people: {
      address: "",
      dni: "",
      firstname: "",
      id: null,
      lastname: "",
      phone: "",
    },
    role: "",
    status: "",
    updatedAt: "",
  })
  const [token, setToken] = useState(localStorage.getItem("token"))

  const [isOpen, setIsOpen] = useState(false)

  const { setMessage } = useToast()

  const value = {
    mode,
    setMode,
    user,
    setUser,
    token,
    setToken,
    isOpen,
    setIsOpen,
    setMessage,
  }

  useEffect(() => {
    localStorage.setItem("mode", mode)
  }, [mode])

  useEffect(() => {
    localStorage.setItem("token", token)
  }, [token])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default InitContext
