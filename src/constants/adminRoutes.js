import HomeIcon from "@mui/icons-material/Home"
import SettingsIcon from "@mui/icons-material/Settings"
import GroupIcon from "@mui/icons-material/Group"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SellIcon from '@mui/icons-material/Sell';

const adminRoutes = [
  {
    label: "Inicio",
    path: "/dashboard",
    Icon: HomeIcon,
  },
  {
    label: "Usuarios",
    path: "/dashboard/users",
    Icon: GroupIcon,
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
    label: "Proveedores",
    path: "/dashboard/providers",
    Icon: LocalShippingIcon,
  },
  {
    label: "Reportes",
    path: "/dashboard/reports",
    Icon: InsertDriveFileIcon,
  },
  {
    label: "Configuración",
    path: "/dashboard/config",
    Icon: SettingsIcon,
  },
]

export default adminRoutes
