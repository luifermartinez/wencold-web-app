import LoadingPage from "@/components/common/LoadingPage"
import { AppContext } from "@/context/AppContext"
import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"

const AdminLayout = () => {
  const { user, token } = useContext(AppContext)

  return token && !user.email ? (
    <LoadingPage />
  ) : user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="" />
  )
}

export default AdminLayout
