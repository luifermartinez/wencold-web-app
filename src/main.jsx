import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import InitContext from "@/context/InitContext"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

ReactDOM.render(
  <React.StrictMode>
    <InitContext>
      <App />
    </InitContext>
  </React.StrictMode>,
  document.getElementById("root")
)
