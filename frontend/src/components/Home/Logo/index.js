import { useEffect, useRef, useState } from 'react'
import LogoT from '../../../assets/images/logo.png'
import './index.scss'

const Logo = () => {
  const [animationState, setAnimationState] = useState(false)
  const bgRef = useRef()
  const solidLogoRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState(true)
    }, 1000)
    return () => clearTimeout(timer) 
  }, [])

  return (
    <div className={`logo-container ${animationState ? 'animate' : ''}`} ref={bgRef}>
      <img className="solid-logo" ref={solidLogoRef} src={LogoT} alt="Logo" />
    </div>
  )
}

export default Logo
