import { createContext } from "react"
export const AppContext = createContext({
  mode: "dark",
  setMode: () => {},
  isOpen: false,
  setIsOpen: () => {},
  user: {
    createdAt: "",
    email: "",
    expiresToken: null,
    id: null,
    image: null,
    people: {
      address: "",
      dni: "",
      firstname: "",
      id: null,
      lastname: "",
      phone: "",
    },
    role: "",
    status: "",
    updatedAt: "",
  },
  setUser: () => {},
  token: "",
  setToken: () => {},
  message: {
    type: "",
    text: "",
  },
  setMessage: () => {},
})
