import { Button, Container, Input } from "reactstrap"
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react"
import { URL} from './utils/config'

const Reset = ({
  setRouter
}) => {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")

  const [errorCaptcha, setErrorCaptcha] = useState("")
  const [captcha, setCaptcha] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if(captcha === "") {
      setErrorCaptcha("Completa el captcha")
      setTimeout(() => {
        setErrorCaptcha("");
      }, 1000);
      return
    }
    fetch(URL + "auth/resetpassword", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({email, newpassword: newPassword})
    })
    .then(res => res.json())
    .then(res => {
      if(!res.ok) {
        throw res
      }
      setRouter('login')
      console.log(res)
    })
    .catch(err => {
      console.log(err)
      setError(err.message)
    })
    .finally(() => {
       setTimeout(() => {
          setError("");
        }, 2000);
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
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email"/>
        <Input
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="new password"
          type="password"/>
        <Button color="primary">
          confirmar
        </Button>
        <ReCAPTCHA
          sitekey="6LeWWuEmAAAAAEBmC56jA46uBiBHP0fkvB4iWken"
          onChange={setCaptcha}
        />
      </form>
    </Container>
  )
}

export default Reset