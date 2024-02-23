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
  const [updateDataFlag, setUpdateDataFlag] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      console.log('Проверяем сессию в App')
      const { responseStatusCode, responseData, responseError } = await getData('/api/session/')
      console.log(responseStatusCode, responseData, responseError)
      if (responseStatusCode === 200) {
        console.log('Сессия найдена. Устанавливаем данные пользователя в App', responseStatusCode, responseData, responseError)
        setIsAuthenticated(true)
        setServerError(responseError)
        setUserID(responseData.userID)
        setUsername(responseData.username)
      }
    }
    getSession()
  }, [])


  return (
    <CloudContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      serverError, setServerError,
      username, setUsername,
      userID, setUserID,
      updateDataFlag, setUpdateDataFlag
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
