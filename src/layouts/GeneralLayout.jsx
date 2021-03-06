import { Box, Container } from "@mui/material"
import { styled } from "@mui/material/styles"
import { Outlet, useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react"
import { AppContext } from "@/context/AppContext"
import Copyright from "@/components/common/Copyright"
import { motion } from "framer-motion"
import Sidebar from "@/components/common/Sidebar"
import Navbar from "@/components/common/Navbar"

const drawerWidth = 300

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
)

const variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.61, 1, 0.88, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.15,
      ease: [0.61, 1, 0.88, 1],
    },
  },
}

const GeneralLayout = () => {
  const { token, isOpen, setIsOpen } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate("/dashboard")
    }
  }, [token])

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      <Box sx={{ disxplay: "flex" }}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <Main
          open={isOpen}
          sx={{
            marginLeft: isOpen ? `${drawerWidth}px` : 0,
          }}
        >
          <Container maxWidth="lg" sx={{ pt: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                minHeight: "calc(100vh - 64px)",
              }}
            >
              <Box>
                <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
                <Outlet />
              </Box>
              <Copyright />
            </Box>
          </Container>
        </Main>
      </Box>
    </motion.div>
  )
}

export default GeneralLayout
