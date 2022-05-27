import HomeIcon from "@mui/icons-material/Home"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import SellIcon from "@mui/icons-material/Sell"
import CategoryIcon from "@mui/icons-material/Category"

const managerRoutes = [
  {
    label: "Inicio",
    path: "/dashboard",
    Icon: HomeIcon,
  },
  {
    label: "Inventario",
    path: "/dashboard/stock",
    Icon: Inventory2Icon,
  },
  {
    label: "Movimientos",
    path: "/dashboard/movements",
    Icon: SellIcon,
  },
  {
    label: "Tipos de productos",
    path: "/dashboard/product-types",
    Icon: CategoryIcon,
  },
]

export default managerRoutes
