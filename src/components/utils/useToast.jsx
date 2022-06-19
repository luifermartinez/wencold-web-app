import { useContext } from "react"
import { AppContext } from "@/context/AppContext"
import { toast } from "react-toastify"

const useToast = () => {
  const { mode } = useContext(AppContext)

  const setMessage = ({ type, text }) => {
    toast[type](
      text,
      mode === "dark"
        ? {
            theme: mode,
          }
        : {}
    )
  }

  return {
    setMessage,
  }
}

export default useToast
