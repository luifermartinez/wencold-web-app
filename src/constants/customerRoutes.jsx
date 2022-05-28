import HomeIcon from "@mui/icons-material/Home"
import CategoryIcon from "@mui/icons-material/Category"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import PaidIcon from "@mui/icons-material/Paid"
import ArticleIcon from '@mui/icons-material/Article';

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
  {
    label: "Mis ordenes",
    path: "/dashboard/my-orders",
    Icon: ArticleIcon,
  },
  {
    label: "Mis pagos",
    path: "/dashboard/my-payments",
    Icon: PaidIcon,
  },
]

export default customerRoutes
