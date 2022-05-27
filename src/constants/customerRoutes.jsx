import HomeIcon from "@mui/icons-material/Home"
import CategoryIcon from "@mui/icons-material/Category"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const customerRoutes = [
  {
    label: "Inicio",
    path: "/dashboard",
    Icon: HomeIcon,
  },
  {
    label: "Productos",
    path: "/dashboard/products",
    Icon: CategoryIcon,
  },
  {
    label: "Carrito de compras",
    path: "/dashboard/shopping-cart",
    Icon: ShoppingCartIcon,
  },
]

export default customerRoutes
