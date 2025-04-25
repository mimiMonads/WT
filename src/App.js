import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import SignIn from './components/SignIn'
import User from './components/User'
import About from './components/About'
import PrivacyPolicy from './components/PrivacyPolicy'
import SignUp from './components/SignUp'
import Board from './components/Board'

import './App.scss'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="user" element={<User />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="board" element={<Board />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
