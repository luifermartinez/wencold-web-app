import Banner from "@/components/common/Banner"
import Page from "@/components/utils/Page"
import { useState } from "react"
import { motion } from "framer-motion"
import Exchange from "./Exchange"
import PaymentMethods from "./PaymentMethods"
import { Button, Stack } from "@mui/material"
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange"
import CreditCardIcon from "@mui/icons-material/CreditCard"

const Config = () => {
  const [selected, setSelected] = useState("exchange")
  return (
    <Page title="InverWencold | Configuración">
      <Banner
        title="Configuración"
        description="Configuración general de la aplicación, en este módulo podrás configurar tasa de cambio del día, y métodos de pago."
      >
        <Stack direction="row" justifyContent="end" spacing={2}>
          <Button
            size="small"
            variant={selected === "exchange" ? "contained" : "outlined"}
            onClick={() => setSelected("exchange")}
            startIcon={<CurrencyExchangeIcon />}
          >
            Tasa de cambio
          </Button>
          <Button
            size="small"
            variant={selected === "payment-methods" ? "contained" : "outlined"}
            onClick={() => setSelected("payment-methods")}
            startIcon={<CreditCardIcon />}
          >
            Métodos de pago
          </Button>
        </Stack>
      </Banner>

      {selected === "exchange" && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Exchange />
        </motion.div>
      )}
      {selected === "payment-methods" && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <PaymentMethods />
        </motion.div>
      )}
    </Page>
  )
}

export default Config
