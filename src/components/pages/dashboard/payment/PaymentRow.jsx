import paymentStatus from "@/constants/paymentStatus"
import paymentStatusColor from "@/constants/paymentStatusColor"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import { LoadingButton } from "@mui/lab"
import { Box, Chip, Grid, Stack, Typography, useTheme } from "@mui/material"
import { useContext, useLayoutEffect, useRef, useState } from "react"
import Lightbox from "react-image-lightbox"
import NumberFormat from "react-number-format"
import { Link } from "react-router-dom"
import CancelIcon from "@mui/icons-material/Cancel"
import CheckIcon from "@mui/icons-material/Check"

const PaymentRow = ({ payment, mutate }) => {
  const { setMessage, user } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  const { shape, palette } = useTheme()
  const [submitting, setSubmitting] = useState(false)
  const image = payment.paymentProof
    ? `${import.meta.env.VITE_BACKEND_API}/image?imagePath=${
        payment.paymentProof.path
      }`
    : `${
        import.meta.env.VITE_BACKEND_API
      }/image?imagePath=default/default-product.png`

  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  const handleWidth = () => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth - 15)
    }
  }

  useLayoutEffect(() => {
    handleWidth()
    window.addEventListener("resize", handleWidth)
    return () => {
      window.removeEventListener("resize", handleWidth)
    }
  }, [])

  const cancelPayment = () => {
    setSubmitting(true)
    fetcherAuth(`/payment/${payment.id}`, null, "PUT")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        mutate()
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: err.message,
        })
        mutate(err)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const updatePayment = (status) => {
    setSubmitting(true)
    fetcherAuth(`/payment/${payment.id}/status`, { status }, "PUT")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        mutate()
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: err.message,
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Grid container item xs={12} sm={6} md={4} lg={3} padding={1}>
      <Stack
        sx={{
          border: 1,
          borderRadius: 1,
          borderColor: "divider",
          p: 1,
          width: "100%",
          boxShadow: 2,
        }}
        ref={ref}
        spacing={2}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="textSecondary" textAlign="left">
            Pago #{payment.id}
          </Typography>
          <Chip
            label={paymentStatus[payment.status]}
            sx={{ borderRadius: 1 }}
            variant="outlined"
            color={paymentStatusColor[payment.status]}
          />
        </Stack>
        <Box
          sx={{
            width: ref.current ? width : 150,
            heigth: ref.current ? width : 150,
            alignSelf: "center",
          }}
        >
          <img
            src={image}
            alt="product image"
            width={ref.current ? width : 150}
            height={ref.current ? width : 150}
            style={{
              objectFit: "cover",
              borderRadius: shape.borderRadius,
              cursor: "pointer",
            }}
            onClick={() => setIsOpen(true)}
          />
          {isOpen && (
            <Lightbox mainSrc={image} onCloseRequest={() => setIsOpen(false)} />
          )}
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ height: "100%" }}
        >
          <Stack sx={{ height: "100%" }} justifyContent="end">
            <Typography variant="body2" color="textSecondary">
              Metodo de Pago
            </Typography>
            <Typography variant="body1">
              {payment?.paymentMethod?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Referencia
            </Typography>
            <Typography variant="body1">{payment?.reference}</Typography>
            <Typography variant="body2" color="textSecondary">
              Orden
            </Typography>
            <Typography variant="link">
              <Link
                to="/dashboard/my-orders/1"
                style={{ color: palette.primary.main }}
              >
                {payment?.billOut?.code}
              </Link>
            </Typography>
          </Stack>
          <Stack alignItems="end" justifyContent="end" sx={{ height: "100%" }}>
            <Typography variant="body2" color="textSecondary">
              Monto
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              <NumberFormat
                displayType="text"
                value={payment.amount}
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
                suffix=" $"
              />
            </Typography>
          </Stack>
        </Stack>
        {payment.status === "pending" && user.role === "customer" && (
          <LoadingButton
            loading={submitting}
            disabled={submitting}
            onClick={cancelPayment}
            variant="outlined"
            startIcon={<CancelIcon />}
            color="warning"
          >
            Cancelar
          </LoadingButton>
        )}
        {user.role === "admin" && payment.status === "pending" && (
          <>
            <LoadingButton
              loading={submitting}
              disabled={submitting}
              onClick={() => updatePayment("approved")}
              variant="outlined"
              startIcon={<CheckIcon />}
              color="success"
            >
              Aprobar
            </LoadingButton>
            <LoadingButton
              loading={submitting}
              disabled={submitting}
              onClick={() => updatePayment("refused")}
              variant="outlined"
              startIcon={<CancelIcon />}
              color="warning"
            >
              Rechazar
            </LoadingButton>
          </>
        )}
      </Stack>
    </Grid>
  )
}

export default PaymentRow
