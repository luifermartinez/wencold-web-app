import { AppContext } from "@/context/AppContext"
import { motion } from "framer-motion"
import { useContext, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

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

const AuthLayout = () => {
  const { token } = useContext(AppContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (token) navigate("/dashboard")
  }, [token])

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      <Outlet />
    </motion.div>
  )
}

export default AuthLayout
