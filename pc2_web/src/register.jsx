import { Button, Container, Input } from "reactstrap"
import { URL} from './utils/config'
import { useState } from "react"
import ReCAPTCHA from "react-google-recaptcha";

const Register = ({
  setRouter
}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const [errorCaptcha, setErrorCaptcha] = useState("")
  const [captcha, setCaptcha] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(captcha)
    if(captcha === "") {
      setErrorCaptcha("Completa el captcha")
      setTimeout(() => {
        setErrorCaptcha("");
      }, 1000);
      return
    }
    fetch(URL+"auth/register", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({email, password})
    })
    .then(res => res.json())
    .then(res => {
        setRouter("app")
    })
    .catch(err => {
      setError(err.message)
    })
    .finally(() => {
       setTimeout(() => {
          setError("");
        }, 1000);
    })

  }

  return (
    <Container className="h-100 d-flex justify-content-center flex-column">
        {
          error !== "" && 
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        }
        {
          errorCaptcha !== "" &&
          <div className="alert alert-danger" role="alert">
            {errorCaptcha}
          </div>
        }
        <form onSubmit={handleSubmit} className='d-flex flex-column gap-3'>
          <Input
            placeholder="Nombre"
            />
          <Input
            placeholder="Apellido"
            />
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email"/>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="password"
            type="password"/>
          <Button color="primary">
            Registrar
          </Button>
          <ReCAPTCHA
            sitekey="6LeWWuEmAAAAAEBmC56jA46uBiBHP0fkvB4iWken"
            onChange={setCaptcha}
          />
          <a onClick={() => setRouter('login')}>ya tienes cuenta? inicia sesion</a>
        </form>
    </Container>
  )
}

export default Register