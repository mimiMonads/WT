// src/components/SignIn/index.jsx
import { useEffect, useState } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const SignIn = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
const host = 'https://api.tripleequal.dev'

  useEffect(() => {
    const id = setTimeout(() => setLetterClass('text-animate-hover'), 3000)
    return () => clearTimeout(id)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const resp = await fetch( host + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Login failed')
      setError('')
      setMessage(data.message)
      // you’re now “logged in”—cookie is set by browser
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container signin-page">
      <div className="text-zone">
        <h1>
          <AnimatedLetters letterClass={letterClass}
            strArray={['S','i','g','n',' ','I','n']} idx={15} />
        </h1>
        <form onSubmit={handleSubmit} className="signin-form">
          <label htmlFor="username">Username</label>
          <input id="username" value={username}
            onChange={e=>setUsername(e.target.value)} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password"
            value={password} onChange={e=>setPassword(e.target.value)} required />

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" className="flat-button">SIGN IN</button>
        </form>
      </div>
    </div>
  )
}

export default SignIn



