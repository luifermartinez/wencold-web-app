import Page from "@/components/utils/Page"
import role from "@/constants/roles"
import { AppContext } from "@/context/AppContext"
import { fetcherAuth, fetcherAuthFormData } from "@/helpers/fetch"
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import Lightbox from "react-image-lightbox"
import moment from "moment"
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto"
import { useForm } from "react-hook-form"
import NumberFormat from "react-number-format"
import { LoadingButton } from "@mui/lab"
import SaveIcon from "@mui/icons-material/Save"

const Profile = () => {
  const { setMessage } = useContext(AppContext)
  const theme = useTheme()
  const { palette } = theme
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef()
  const [submitting, setSubmitting] = useState(false)
  const [submittingPass, setSubmittingPass] = useState(false)

  const md = useMediaQuery(theme.breakpoints.up("md"))

  const [profile, setProfile] = useState(null)

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      people: {
        firstname: "",
        lastname: "",
        dni: "",
        phone: "",
        address: "",
      },
    },
  })

  const formPassword = useForm({
    mode: "onChange",
    defaultValues: {
      actual_password: "",
      password: "",
      password_confirmation: "",
    },
  })

  const fetchProfile = useCallback(async () => {
    fetcherAuth("/profile")
      .then((res) => {
        setProfile(res.data)
        reset(res.data)
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfilePicture = (e) => {
    const { files } = e.target
    if (files[0]) {
      const formData = new FormData()
      formData.append("image", files[0])
      fetcherAuthFormData("/profile/image", formData, "PUT")
        .then(() => {
          setMessage({
            type: "success",
            text: "Foto de perfil actualizada satisfactoriamente.",
          })
          fetchProfile()
        })
        .catch((error) => {
          setMessage({
            type: "error",
            text: error.message,
          })
        })
    }
  }

  const save = (values) => {
    setSubmitting(true)
    const payload = {
      ...values,
      people: {
        ...values.people,
      },
    }
    fetcherAuth("/profile", payload, "PUT")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        fetchProfile()
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

  const savePassword = (values) => {
    setSubmittingPass(true)
    fetcherAuth("/profile/password", values, "PUT")
      .then((res) => {
        setMessage({
          type: "success",
          text: res.message,
        })
        formPassword.reset({
          actual_password: "",
          password: "",
          password_confirmation: "",
        })
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.message,
        })
      })
      .finally(() => {
        setSubmittingPass(false)
      })
  }

  return (
    <Page title="InverWencold | Mi perfil">
      <Card>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid
            item
            md={6}
            xs={12}
            sx={{ backgroundColor: palette.divider, p: 3 }}
            justifyContent={!md ? "center" : "flex-start"}
            container
          >
            <Box
              sx={{
                borderRadius: "150px",
                border: 1,
                borderColor: palette.background.default,
                width: 150,
                height: 150,
                position: "relative",
              }}
            >
              <img
                src={
                  profile
                    ? profile.image
                      ? `${import.meta.env.VITE_BACKEND_API}/image?imagePath=${
                          profile.image.path
                        }`
                      : `${
                          import.meta.env.VITE_BACKEND_API
                        }/image?imagePath=default/default.png`
                    : `${
                        import.meta.env.VITE_BACKEND_API
                      }/image?imagePath=default/default.png`
                }
                onClick={() => setIsOpen(true)}
                alt="profile"
                width={150}
                height={150}
                style={{
                  zIndex: 1,
                  borderRadius: 75,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg, image/png"
                onChange={updateProfilePicture}
                style={{ display: "none" }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                  backgroundColor: palette.background.paper,
                  border: 1,
                  borderColor: palette.divider,
                }}
                onClick={() => inputRef.current.click()}
              >
                <InsertPhotoIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ backgroundColor: palette.divider, p: 3 }}
            justifyContent={!md ? "center" : "end"}
            container
          >
            <Stack
              justifyContent={"space-between"}
              alignSelf="stretch"
              direction={md ? "column" : "row"}
              sx={{ width: "100%" }}
              alignItems="end"
            >
              <Typography
                variant="button"
                borderRadius={1}
                bgcolor={palette.primary.main}
                color={palette.primary.contrastText}
                lineHeight={1}
                p={1}
              >
                {profile ? role[profile?.role] : "Cargando..."}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="right"
              >
                Registrado desde{" "}
                {profile
                  ? moment(profile.createdAt).format("DD/MM/YYYY")
                  : "Cargando..."}
              </Typography>
            </Stack>
            {isOpen && (
              <Lightbox
                mainSrc={
                  profile
                    ? profile?.image
                      ? `${import.meta.env.VITE_BACKEND_API}/image?imagePath=${
                          profile.image.path
                        }`
                      : `${
                          import.meta.env.VITE_BACKEND_API
                        }/image?imagePath=default/default.png`
                    : `${
                        import.meta.env.VITE_BACKEND_API
                      }/image?imagePath=default/default.png`
                }
                onCloseRequest={() => setIsOpen(false)}
              />
            )}
          </Grid>
        </Grid>
        <CardContent
          sx={{ position: "relative" }}
          component="form"
          onSubmit={handleSubmit(save)}
        >
          <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
              Mi perfil
            </Typography>
            <Divider />
            <Typography variant="h6" component="h2">
              Información personal
            </Typography>
            <Grid container>
              <Grid item xs={12} marginX={1}>
                <TextField
                  fullWidth
                  label="DNI o Cédula de Identidad"
                  variant="standard"
                  {...register("people.dni")}
                  InputLabelProps={{ shrink: !!watch("people.dni") }}
                  disabled
                />
              </Grid>
              <Grid item container xs>
                <Grid item xs={12} md={6} paddingX={1} marginTop={2}>
                  <TextField
                    fullWidth
                    label="Nombre (s)"
                    color={errors?.people?.firstname ? "error" : "primary"}
                    InputLabelProps={{ shrink: !!watch("people.firstname") }}
                    variant="standard"
                    helperText={
                      errors?.people?.firstname &&
                      errors?.people?.firstname.message
                    }
                    autoComplete="off"
                    {...register("people.firstname", {
                      required: {
                        value: true,
                        message: "El campo es requerido",
                      },
                      pattern: {
                        value:
                          /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                        message: "El nombre solo puede contener letras",
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6} paddingX={1} marginTop={2}>
                  <TextField
                    fullWidth
                    label="Apellido (s)"
                    color={errors?.people?.lastname ? "error" : "primary"}
                    InputLabelProps={{ shrink: !!watch("people.lastname") }}
                    variant="standard"
                    helperText={
                      errors?.people?.lastname &&
                      errors?.people?.lastname.message
                    }
                    autoComplete="off"
                    {...register("people.lastname", {
                      required: {
                        value: true,
                        message: "El campo es requerido",
                      },
                      pattern: {
                        value:
                          /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
                        message:
                          "El (los) apellido (s) solo puede contener letras",
                      },
                    })}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} paddingX={1} marginTop={2}>
                <NumberFormat
                  fullWidth
                  customInput={TextField}
                  variant="standard"
                  format="(###) ###-####"
                  label="Número de teléfono"
                  InputLabelProps={{ shrink: !!watch("people.phone") }}
                  color={errors?.people?.phone ? "error" : "primary"}
                  autoComplete="off"
                  helperText={
                    errors?.people?.phone && errors?.people?.phone.message
                  }
                  value={watch("people.phone")}
                  onValueChange={(values) => {
                    const { value } = values
                    setValue("people.phone", value)
                  }}
                  {...register("people.phone", {
                    minLength: {
                      value: 10,
                      message: "El número de teléfono debe tener 10 carácteres",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message:
                        "El número de teléfono solo puede contener números",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} paddingX={1} marginTop={2}>
                <TextField
                  label="Dirección"
                  fullWidth
                  variant="standard"
                  autoComplete="off"
                  InputLabelProps={{ shrink: !!watch("people.address") }}
                  color={errors?.people?.address ? "error" : "primary"}
                  helperText={
                    errors?.people?.address && errors?.people?.address.message
                  }
                  {...register("people.address")}
                />
              </Grid>
            </Grid>
            <LoadingButton
              startIcon={<SaveIcon />}
              variant="contained"
              type="submit"
              loading={submitting}
            >
              Guardar
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardContent
          component="form"
          onSubmit={formPassword.handleSubmit(savePassword)}
        >
          <Stack spacing={2}>
            <Typography variant="h6" component="h2">
              Información de acceso
            </Typography>
            <TextField
              label="Contraseña actual"
              fullWidth
              variant="standard"
              type="password"
              color={
                formPassword.formState.errors.actual_password
                  ? "error"
                  : "primary"
              }
              helperText={
                formPassword.formState.errors.actual_password &&
                formPassword.formState.errors.actual_password.message
              }
              {...formPassword.register("actual_password", {
                required: {
                  value: true,
                  message: "El campo es requerido",
                },
              })}
            />
            <TextField
              label="Contraseña"
              fullWidth
              variant="standard"
              type="password"
              color={
                formPassword.formState.errors.password ? "error" : "primary"
              }
              helperText={
                formPassword.formState.errors.password &&
                formPassword.formState.errors.password.message
              }
              {...formPassword.register("password", {
                required: {
                  value: true,
                  message: "El campo es requerido",
                },
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 carácteres",
                },
              })}
            />
            <TextField
              label="Confirmar contraseña"
              fullWidth
              variant="standard"
              type="password"
              color={
                formPassword.formState.errors.password_confirmation
                  ? "error"
                  : "primary"
              }
              helperText={
                formPassword.formState.errors.password_confirmation &&
                formPassword.formState.errors.password_confirmation.message
              }
              {...formPassword.register("password_confirmation", {
                required: {
                  value: true,
                  message: "El campo es requerido",
                },
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 carácteres",
                },
                validate: (value) => {
                  const password = formPassword.watch("password")
                  return value === password || "Las contraseñas no coinciden"
                },
              })}
            />
            <LoadingButton
              startIcon={<SaveIcon />}
              variant="contained"
              type="submit"
              loading={submittingPass}
            >
              Guardar
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}

export default Profile
