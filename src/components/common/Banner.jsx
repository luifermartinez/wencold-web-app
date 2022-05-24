import { Card, Typography } from "@mui/material"

const Banner = ({ title, description, children }) => {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        marginBottom={description ? 3 : 0}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        component="p"
        marginBottom={children ? 3 : 0}
      >
        {description}
      </Typography>
      {children}
    </Card>
  )
}

export default Banner
