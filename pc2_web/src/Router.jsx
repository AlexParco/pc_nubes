import Login from "./login.jsx"
import App from "./App"
import Register from './register.jsx'
import Reset from './resetpassword.jsx'
import { useState } from "react"

const Router = () => {
  const [routerName, setRouterName] = useState("login")

  if(routerName === "register") {
    return <Register setRouter={setRouterName} />
  }
  if(routerName === "login") {
    return <Login setRouter={setRouterName}/>
  }
  if(routerName === "reset") {
    return <Reset setRouter={setRouterName}/>
  }
  if(routerName === "app") {
    return <App setRouter={setRouterName}/>
  }
}

export default Router