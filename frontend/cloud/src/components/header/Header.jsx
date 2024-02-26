import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloudContext } from '../../contexts/CloudContext.js'

import './Header.scss'
import useRequest from '../../hooks/useRequest.jsx'

const Header = () => {

  const {isAuthenticated, setIsAuthenticated, username, setUsername, setUserID, isAdmin, setIsAdmin} = useContext(CloudContext)
  const [dataLogout, loadingLogout, errorLogout, requestLogout] = useRequest()

  const logout = async () => {
    const init = {
      credentials: 'include'
    }
    await requestLogout('/api/logout/', init)
  }

  useEffect(() => {
    if (dataLogout.status === 200) {
      setIsAuthenticated(false)
      setUsername(false)
      setUserID(false)
      setIsAdmin(false)
    }
  }, [dataLogout])

  return (
    <header className="header">
      <Link to="/"><div className="header__logo">CLOUD</div></Link>
      <nav className="header__nav">
        <ul className="header__nav-items">
          {isAdmin && <li className="header__nav-item"><Link to="/admin-panel">Панель управления</Link></li>}
          {!isAuthenticated
            ? <li className="header__nav-item"><Link to="/login">Войти</Link></li>
            :
              <>
                <li className="header__nav-item"><Link to="/dashboard">{username}</Link></li>
                <li className="header__nav-item" onClick={logout}>Выйти</li>
              </>
          }
        </ul>
      </nav>
    </header>
  )
}

export default Header