import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Registration from './components/registration/Registration.jsx'
import { CloudContext } from './contexts/CloudContext.js'
import Login from './components/login/Login.jsx'

import './App.scss'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const [productDetailCard, setProductDetailCard] = useState('loading');
  // const [cartProducts, setCartProducts] = useState([]);
  // const [totalCartCount, setTotalCartCount] = useState(0);
  // const [totalCost, setTotalCost] = useState(0);
  // const [sendOrderFlag, setSendOrderFlag] = useState('no loading');

  return (
    <CloudContext.Provider value={{
      isAuthenticated, setIsAuthenticated
    }}>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </CloudContext.Provider>
  )
}

export default App
