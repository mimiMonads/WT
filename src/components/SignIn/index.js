import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const SignIn = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() =>{
    const timeoutId = setTimeout(() => {
        setLetterClass('text-animate-hover')
    }, 3000)
    return () => clearTimeout(timeoutId)
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Signing in with:', { email, password })

  }

  return (
    <>
      <div className="container signin-page">
        <div className="text-zone">
            <h1>
                <AnimatedLetters
                letterClass={letterClass}
                strArray={['S', 'i', 'g', 'n', ' ', 'i', 'n']}
                idx={15}
            />
            </h1>
            <form onSubmit={handleSubmit} className="signin-form">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          
            <div className="forgot-password">
              <a href="/forgotpassword">Forgot Password?</a>
            </div>

            <button type="submit" className="flat-button">
              SIGN IN
            </button>
          </form>
        </div>


      </div>
      <Loader type="pacman" />
    </>
  )
}

export default SignIn