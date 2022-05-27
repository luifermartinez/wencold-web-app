import LoadingPage from "@/components/common/LoadingPage"
import { AppContext } from "@/context/AppContext"
import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"

const AdminManagerLayout = () => {
  const { user, token } = useContext(AppContext)

  return token && !user.email ? (
    <LoadingPage />
  ) : user.role === "admin" || user.role === "manager" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" />
  )
}

export default AdminManagerLayout
