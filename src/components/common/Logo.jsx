import { AppContext } from "@/context/AppContext"
import { Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useContext } from "react"
import { Link } from "react-router-dom"

const shadow = {
  h1: "8px 8px #558ABB",
  h2: "6px 6px #558ABB",
  h3: "4px 4px #558ABB",
  h4: "4px 4px #558ABB",
  h5: "3px 3px #558ABB",
  h6: "3px 3px #558ABB",
}
const shadowLight = {
  h1: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 8px 8px #558ABB",
  h2: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 6px 6px #558ABB",
  h3: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 4px 4px #558ABB",
  h4: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 4px 4px #558ABB",
  h5: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 3px 3px #558ABB",
  h6: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 3px 3px #558ABB",
}

const Logo = ({ size }) => {
  const { mode } = useContext(AppContext)

  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <Typography
        component="h1"
        variant={size}
        fontWeight="bold"
        sx={{
          textShadow:
            mode === "dark"
              ? shadow[size]
                ? shadow[size]
                : "none"
              : shadowLight[size]
              ? shadowLight[size]
              : "none",
          color: "white",
        }}
      >
        InverWencold
      </Typography>
    </Link>
  )
}

Logo.propTypes = {
  size: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "caption",
    "button",
    "overline",
  ]),
}

Logo.defaultProps = {
  size: "h1",
}

export default Logo
