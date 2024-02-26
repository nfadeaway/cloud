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
import useRequest from './hooks/useRequest.jsx'
import ExternalFileDownload from './components/externalfiledownload/ExternalFileDownload.jsx'
import AdminPanel from './components/adminpanel/AdminPanel.jsx'
import AdminRoutes from './utils/AdminRoutes.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState(null)
  const [userID, setUserID] = useState(null)
  const [updateDataFlag, setUpdateDataFlag] = useState(false)
  const [dataSession, loadingSession, errorSession, requestSession] = useRequest()

  useEffect(() => {
    console.log('Проверяем текущую сессию')
    requestSession('/api/session/', {credentials: 'include'})
  }, [])

  useEffect(() => {
    if (dataSession.status === 200) {
      console.log('Сессия найдена', dataSession)
      setIsAuthenticated(true)
      setUserID(dataSession.result.userID)
      setUsername(dataSession.result.username)
      setIsAdmin(dataSession.result.isAdmin)
    }
  }, [dataSession])

  return (
    <CloudContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      username, setUsername,
      userID, setUserID,
      updateDataFlag, setUpdateDataFlag,
      isAdmin, setIsAdmin
    }}>
      <Header />
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route element={<AdminRoutes />}>
          <Route path="/admin-panel" element={<AdminPanel />} exact />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} exact />
        </Route>
        <Route path="/f/*" element={<ExternalFileDownload />} />
      </Routes>
    </CloudContext.Provider>
  )
}

export default App
