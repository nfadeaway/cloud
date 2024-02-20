import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Registration from './components/registration/Registration.jsx'
import { CloudContext } from './contexts/CloudContext.js'
import Login from './components/login/Login.jsx'

import './App.scss'
import Dashboard from './components/dashboard/Dashboard.jsx'
import PrivateRoutes from './utils/PrivateRoutes.jsx'
import Main from './components/main/Main.jsx'
import Header from './components/header/Header.jsx'
import getData from './utils/getData.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null)
  const [userID, setUserID] = useState(null)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      console.log('Проверяем сессию в App')
      const { statusCode, data, error } = await getData('/api/session/')
      console.log(statusCode, data, error)
      if (statusCode === 200) {
        console.log('Сессия найдена. Устанавливаем данные пользователя в App', statusCode, data, error)
        setIsAuthenticated(true)
        setServerError(error)
        setUserID(data.userID)
        setUsername(data.username)
      }
    }
    getSession()
  }, [])


  return (
    <CloudContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      serverError, setServerError,
      username, setUsername,
      userID, setUserID
    }}>
      <Header />
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} exact />
        </Route>

        {/*<Route path="*" component={NotFoundSection} path='*' />*/}
      </Routes>
    </CloudContext.Provider>
  )
}

export default App
