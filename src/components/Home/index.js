import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import Logo from './Logo'
import './index.scss'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  const nameArray = ['T', 'a', 'l', 'k']
  const mottoArray = ['Q', '&', 'A', ' ', 'f', 'o', 'r', ' ', 'D ', 'e', 'v', 's']


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 4000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <div className="container home-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters letterClass={letterClass} strArray={nameArray} idx={11}/>
            <br /> <br />
            <AnimatedLetters letterClass={letterClass} strArray={mottoArray} idx={22}/>
          </h1>
          <h2>The safe space for asking questions</h2>
          <Link to="/signIn" className="flat-button"> SIGN IN </Link>
        </div>
        <Logo />
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home
