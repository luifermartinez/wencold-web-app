import { AppContext } from "@/context/AppContext"
import { useContext } from "react"

export const useGetApp = () => {
  const app = useContext(AppContext)

  return app
}
