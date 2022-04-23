import PropTypes from "prop-types"
import { Helmet } from "react-helmet-async"
import { Box } from "@mui/material"

const Page = ({ children, title = "", ...other }) => (
  <Box {...other}>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}
  </Box>
)

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
}

export default Page
