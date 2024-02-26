import { Navigate, Outlet } from 'react-router-dom'
import { CloudContext } from '../contexts/CloudContext'
import { useContext } from 'react'

const AdminRoutes = () => {
  const {isAuthenticated, isAdmin} = useContext(CloudContext)

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to='/login' />
}

export default AdminRoutes