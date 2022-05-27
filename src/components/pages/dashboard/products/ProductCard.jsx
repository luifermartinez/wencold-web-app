import { Card, CardContent, CardMedia, Stack, Typography } from "@mui/material"
import { useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const ProductCard = ({ stock, lastExchange }) => {
  const ref = useRef(null)
  const navigate = useNavigate()

  const [width, setWidth] = useState(0)

  const handleWidth = () => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }

  const images = stock.product.productImage.map(
    (productImage) =>
      `${import.meta.env.VITE_BACKEND_API}/image?imagePath=${
        productImage.image.path
      }`
  )

  useLayoutEffect(() => {
    handleWidth()
    window.addEventListener("resize", handleWidth)
    return () => {
      window.removeEventListener("resize", handleWidth)
    }
  }, [])

  return (
    <Card
      ref={ref}
      sx={{ cursor: "pointer" }}
      onClick={() => navigate(`${stock.id}`)}
    >
      <CardMedia
        component="img"
        height={ref.current ? width : 150}
        image={
          stock.product.productImage.length > 0
            ? images[0]
            : `${
                import.meta.env.VITE_BACKEND_API
              }/image?imagePath=default/default-product.png`
        }
        alt="product image"
        style={{ objectFit: "contain" }}
      />
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">
              {stock.product.price.toFixed(2)} $
            </Typography>
            {lastExchange && (
              <Typography variant="body1">
                {Number(stock.product.price * lastExchange).toFixed(2)} BsD
              </Typography>
            )}
          </Stack>
          <Typography
            variant="body2"
            fontSize={12}
            color={stock.available > 0 ? "primary" : "error"}
          >
            {stock.available > 0 ? "Disponible" : "No disponible"}
          </Typography>
          <Typography variant="body1">{stock.product.name}</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProductCard
