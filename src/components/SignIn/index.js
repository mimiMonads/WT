import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const SignIn = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  useEffect(() =>{
    const timeoutId = setTimeout(() => {
        setLetterClass('text-animate-hover')
    }, 3000)
    return () => clearTimeout(timeoutId)
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log('Signing in with:', { email, password })
        
    // Test login
        const validEmail = '123@abc.ie'
        const validPassword = '1234'
    
        if (email === validEmail && password === validPassword) {
          setError('')
          console.log('Logged in!')
          // Navigate to dashboard or user page here
        } else {
          setError('Incorrect email or password.')
        }
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
            type='password'
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          {error && <div className="error-message">{error}</div>}

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