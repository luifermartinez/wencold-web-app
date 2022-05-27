import NotFound from "@/components/pages/NotFound"
import Page from "@/components/utils/Page"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth } from "@/helpers/fetch"
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useParams } from "react-router-dom"
import Lightbox from "react-image-lightbox"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { useForm } from "react-hook-form"
import { LoadingButton } from "@mui/lab"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"

const ProductDetail = () => {
  const { id } = useParams()
  const { setMessage } = useContext(AppContext)
  const { palette, shape } = useTheme()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [lastExchange, setLastExchange] = useState(null)
  const ref = useRef(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      quantity: 0,
    },
  })

  const [width, setWidth] = useState(0)

  const handleWidth = () => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }

  useLayoutEffect(() => {
    handleWidth()
    window.addEventListener("resize", handleWidth)
    return () => {
      window.removeEventListener("resize", handleWidth)
    }
  }, [product, imageIndex, ref, loading])

  const fetchLastExchange = useCallback(() => {
    fetcherAuth(`/exchange/last`)
      .then((res) => {
        setLastExchange(res.data.bsEquivalence)
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message })
      })
  }, [])

  useEffect(() => {
    fetchLastExchange()
  }, [fetchLastExchange])

  const fetchProduct = useCallback(() => {
    if (id) {
      setLoading(true)
      fetcherAuth(`/product/${id}`)
        .then((res) => {
          setProduct(res.data)
          if (res.data.product.productImage.length > 0) {
            setImages(
              res.data.product.productImage.map(
                (productImage) =>
                  `${import.meta.env.VITE_BACKEND_API}/image?imagePath=${
                    productImage.image.path
                  }`
              )
            )
          } else {
            setImages([
              `${
                import.meta.env.VITE_BACKEND_API
              }/image?imagePath=default/default-product.png`,
            ])
          }
          if (res.data.available > 0) {
            reset({
              quantity: 1,
            })
          }
        })
        .catch((error) => setMessage(error.message))
        .finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const nextImage = () => setImageIndex((imageIndex + 1) % images.length)
  const previousImage = () =>
    setImageIndex((imageIndex + images.length - 1) % images.length)

  const handleAddToCard = (values) => {
    if (product) {
      if (product.available <= 0) {
        return setMessage({
          type: "error",
          text: "El producto no está disponible",
        })
      }
      setSubmitting(true)
      fetcherAuth(
        `/shopping-cart`,
        {
          stock: product.id,
          quantity: values.quantity,
        },
        "POST"
      )
        .then((data) => {
          setMessage({
            type: "success",
            text: data.message,
          })
        })
        .catch((error) => {
          setMessage({
            type: "error",
            text: error.message,
          })
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  }

  console.log(imageIndex)

  return id ? (
    <Page title="InverWencold | Detalle de producto">
      <Card>
        <CardContent
          component={"form"}
          onSubmit={handleSubmit(handleAddToCard)}
        >
          {!loading ? (
            <Grid container>
              <Grid item xs={12} md={9} lg={8} ref={ref}>
                <Box
                  sx={{
                    height: ref.current ? width : "auto",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <IconButton
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: palette.background.default,
                    }}
                    onClick={previousImage}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: palette.background.default,
                    }}
                    onClick={nextImage}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                  <img
                    src={images[imageIndex]}
                    style={{
                      height: width,
                      width: width,
                      objectFit: "contain",
                      borderRadius: shape.borderRadius,
                    }}
                    onClick={() => setIsOpen(true)}
                  />
                  {isOpen && (
                    <Lightbox
                      mainSrc={images[imageIndex]}
                      onCloseRequest={() => setIsOpen(false)}
                      nextSrc={images[(imageIndex + 1) % images.length]}
                      prevSrc={
                        images[(imageIndex + images.length - 1) % images.length]
                      }
                      onMovePrevRequest={previousImage}
                      onMoveNextRequest={nextImage}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={3} lg={4}>
                <Stack justifyContent={"space-between"} sx={{ height: "100%" }}>
                  <Stack spacing={3} sx={{ p: 2 }}>
                    <Stack>
                      <Typography variant="body2" color="textSecondary">
                        Nombre del producto
                      </Typography>
                      <Typography variant="h5">
                        {product?.product.name}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="body2" color="textSecondary">
                        Tipo de producto
                      </Typography>
                      <Typography variant="body1">
                        {product?.product.productType.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Descripción
                      </Typography>
                      <Typography variant="body1">
                        {product?.product.productType.description}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{ p: 2 }} spacing={2}>
                    <Stack>
                      <Typography variant="body2" color="textSecondary">
                        Disponibles
                      </Typography>
                      <Typography variant="h5">{product.available}</Typography>
                    </Stack>
                    {product.available > 0 && (
                      <FormControl variant="outlined" fullWidth size="small">
                        <InputLabel id="quantity">Cantidad</InputLabel>
                        <Select
                          labelId="quantity"
                          label="Cantidad"
                          {...register("quantity", {
                            required: "Debe seleccionar una cantidad",
                          })}
                        >
                          {Array.from({ length: product.available }).map(
                            (val, i) => (
                              <MenuItem key={i} value={i + 1}>
                                {i + 1}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    )}
                    <Stack>
                      <Typography variant="body2" color="textSecondary">
                        Precio
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {product?.product.price.toFixed(2)} $
                      </Typography>
                      {lastExchange && (
                        <Typography variant="h6">
                          {Number(
                            product?.product.price * lastExchange
                          ).toFixed(2)}{" "}
                          BsD
                        </Typography>
                      )}
                    </Stack>
                    <LoadingButton
                      loading={submitting}
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      type="submit"
                      color={product.available <= 0 ? "warning" : "primary"}
                    >
                      {product.available > 0 ? "Agregar al carrito" : "Agotado"}
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CircularProgress />
              <Typography marginTop={2} variant="h5">
                Cargando producto...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Page>
  ) : (
    <NotFound />
  )
}

export default ProductDetail
