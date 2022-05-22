import { AppContext } from "@/context/AppContext"
import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"

const AdminLayout = () => {
  const { user } = useContext(AppContext)

  return user.role === "admin" ? <Outlet /> : <Navigate to="" />
}

export default AdminLayout
