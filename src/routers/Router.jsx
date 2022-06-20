import SignIn from "@/components/pages/auth/SignIn"
import SignUp from "@/components/pages/auth/SignUp"
import Dashboard from "@/components/pages/dashboard"
import Config from "@/components/pages/dashboard/config"
import CreatePaymentMethod from "@/components/pages/dashboard/config/CreatePaymentMethod"
import Movements from "@/components/pages/dashboard/movements"
import Products from "@/components/pages/dashboard/products"
import ProductDetail from "@/components/pages/dashboard/products/detail"
import ProductTypes from "@/components/pages/dashboard/productTypes"
import Providers from "@/components/pages/dashboard/providers"
import CreateProvider from "@/components/pages/dashboard/providers/new"
import Reports from "@/components/pages/dashboard/reports"
import ShoppingCart from "@/components/pages/dashboard/shopping-cart"
import Stock from "@/components/pages/dashboard/stock"
import Entry from "@/components/pages/dashboard/stock/entry"
import EditProduct from "@/components/pages/dashboard/stock/stock/EditProduct"
import Users from "@/components/pages/dashboard/users"
import CreateUser from "@/components/pages/dashboard/users/new"
import Landing from "@/components/pages/landing"
import NotFound from "@/components/pages/NotFound"
import Profile from "@/components/pages/profile"
import AdminLayout from "@/layouts/AdminLayout"
import AdminManagerLayout from "@/layouts/AdminManagerLayout"
import AuthLayout from "@/layouts/AuthLayout"
import CustomerLayout from "@/layouts/CustomerLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import GeneralLayout from "@/layouts/GeneralLayout"
import ManagerLayout from "@/layouts/ManagerLayout"
import { AnimatePresence } from "framer-motion"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"
import Orders from "@/components/pages/dashboard/my-orders"
import OrderDetail from "@/components/pages/dashboard/my-orders/OrderDetail"
import Payments from "@/components/pages/dashboard/payment"
import CreatePayment from "@/components/pages/dashboard/payment/CreatePayment"
import CreateBillOut from "@/components/pages/dashboard/stock/billout/CreateBillOut"
import Forgot from "@/components/pages/auth/Forgot"

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
          <Route path="profile" element={<Profile />} />
          <Route path="" element={<AdminLayout />}>
            <Route path="config">
              <Route path="" element={<Config />} />
              <Route path="payment-methods" element={<CreatePaymentMethod />}>
                <Route path="" element={<CreatePaymentMethod />} />
                <Route path=":id" element={<CreatePaymentMethod />} />
              </Route>
            </Route>
            <Route path="users">
              <Route path="" element={<Users />} />
              <Route path="new" element={<CreateUser />} />
            </Route>
            <Route path="providers">
              <Route path="" element={<Providers />} />
              <Route path="new" element={<CreateProvider />} />
            </Route>
            <Route path="reports" element={<Reports />} />
            <Route path="payments" element={<Payments />} />
            <Route path="orders">
              <Route path="" element={<Orders />} />
              <Route path=":id" element={<OrderDetail />} />
            </Route>
          </Route>
          <Route path="stock" element={<AdminManagerLayout />}>
            <Route path="" element={<Stock />} />
            <Route path=":id" element={<EditProduct />} />
            <Route path="order" element={<CreateBillOut />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="entry" element={<ManagerLayout />}>
              <Route path="" element={<Entry />} />
            </Route>
          </Route>
          <Route path="movements" element={<AdminManagerLayout />}>
            <Route path="" element={<Movements />} />
          </Route>
          <Route path="product-types" element={<ManagerLayout />}>
            <Route path="" element={<ProductTypes />} />
          </Route>
          <Route path="" element={<CustomerLayout />}>
            <Route path="products">
              <Route path="" element={<Products />} />
              <Route path=":id" element={<ProductDetail />} />
            </Route>
            <Route path="my-payments">
              <Route path="" element={<Payments />} />
              <Route path="new/:id" element={<CreatePayment />} />
            </Route>
            <Route path="my-orders">
              <Route path="" element={<Orders />} />
              <Route path=":id" element={<OrderDetail />} />
            </Route>
            <Route path="shopping-cart" element={<ShoppingCart />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
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
