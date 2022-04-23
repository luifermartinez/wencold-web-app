import { AppContext } from "@/context/AppContext"
import { Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useContext } from "react"
import { Link } from "react-router-dom"

const shadow = {
  h1: "5px 5px #558ABB, 10px 10px rgba(166, 59, 255, .6)",
  h2: "3px 3px #558ABB, 6px 6px rgba(166, 59, 255, .6)",
  h3: "2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
  h4: "2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
  h5: "2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
  h6: "2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
}
const shadowLight = {
  h1: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 5px 5px #558ABB, 10px 10px rgba(166, 59, 255, .6)",
  h2: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 3px 3px #558ABB, 6px 6px rgba(166, 59, 255, .6)",
  h3: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
  h4: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
  h5: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
  h6: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 2px 2px #558ABB, 4px 4px rgba(166, 59, 255, .6)",
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
        appart.dev
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
