import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import SignIn from './components/SignIn'
import About from './components/About'
import PrivacyPolicy from './components/PrivacyPolicy'

import './App.scss'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
