import { Navigate, Outlet } from 'react-router-dom'
import { CloudContext } from '../contexts/CloudContext'
import { useContext } from 'react'

const PrivateRoutes = () => {
  const {isAuthenticated} = useContext(CloudContext)

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoutes