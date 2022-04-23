import SignIn from "@/components/pages/auth/SignIn"
import Landing from "@/components/pages/landing"
import AuthLayout from "@/layouts/AuthLayout"
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
        <Route path="auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignIn />} />
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
