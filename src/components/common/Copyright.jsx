import { Link, Typography } from "@mui/material"

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      mb={2}
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/luifermartinez">
        luifermartinez @github
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  )
}
