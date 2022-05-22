import HomeIcon from "@mui/icons-material/Home"
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

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
