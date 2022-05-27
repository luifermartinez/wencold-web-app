import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { Button, Stack } from "@mui/material"
import { motion } from "framer-motion"
import { useContext, useState } from "react"
import EntryInvoice from "@/components/pages/dashboard/stock/entry/entry"
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox"
import InventoryIcon from "@mui/icons-material/Inventory"
import OutboxIcon from "@mui/icons-material/Outbox"
import Inventory from "./stock"
import { AppContext } from "@/context/AppContext"

const Stock = () => {
  const [selected, setSelected] = useState("stock")
  const { user } = useContext(AppContext)

  const title =
    selected === "stock"
      ? "Inventario"
      : selected === "entry"
      ? "Ingreso de productos"
      : "Salida de productos"

  const description =
    selected === "stock"
      ? "Módulo de inventario. En esta sección podrás gestionar los productos que tienes en tu almacén."
      : selected === "entry"
      ? "Módulo de ingreso de productos. En esta sección podrás gestionar los ingresos de productos."
      : "Módulo de salida de productos. En esta sección podrás gestionar los salidas de productos."

  return (
    <Page title={`InverWencold | ${title}`}>
      <Banner title={title} description={description}>
        <Stack justifyContent={"end"} spacing={2} direction="row">
          <Button
            variant={selected === "stock" ? "contained" : "outlined"}
            startIcon={<InventoryIcon />}
            size="small"
            onClick={() => setSelected("stock")}
          >
            Inventario
          </Button>
          {user.role === "manager" && (
            <>
              <Button
                variant={selected === "entry" ? "contained" : "outlined"}
                startIcon={<MoveToInboxIcon />}
                size="small"
                onClick={() => setSelected("entry")}
              >
                Ingreso de productos
              </Button>
              <Button
                variant={selected === "billout" ? "contained" : "outlined"}
                startIcon={<OutboxIcon />}
                size="small"
                onClick={() => setSelected("billout")}
              >
                Salida de productos
              </Button>
            </>
          )}
        </Stack>
      </Banner>
      {selected === "stock" && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Inventory />
        </motion.div>
      )}
      {selected === "entry" && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <EntryInvoice />
        </motion.div>
      )}
    </Page>
  )
}

export default Stock
