import SignIn from "@/components/pages/auth/SignIn"
import Dashboard from "@/components/pages/dashboard"
import Config from "@/components/pages/dashboard/config"
import Providers from "@/components/pages/dashboard/providers"
import CreateProvider from "@/components/pages/dashboard/providers/new"
import Reports from "@/components/pages/dashboard/reports"
import Users from "@/components/pages/dashboard/users"
import CreateUser from "@/components/pages/dashboard/users/new"
import Landing from "@/components/pages/landing"
import NotFound from "@/components/pages/NotFound"
import AdminLayout from "@/layouts/AdminLayout"
import AuthLayout from "@/layouts/AuthLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import GeneralLayout from "@/layouts/GeneralLayout"
import { AnimatePresence } from "framer-motion"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<GeneralLayout />}>
          <Route path="" element={<Landing />} />
        </Route>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="" element={<AdminLayout />}>
            <Route path="config" element={<Config />} />
            <Route path="users">
              <Route path="" element={<Users />} />
              <Route path="new" element={<CreateUser />} />
            </Route>
            <Route path="providers">
              <Route path="" element={<Providers />} />
              <Route path="new" element={<CreateProvider />} />
            </Route>
            <Route path="reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    </AnimatePresence>
  )
}

const Router = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default Router
