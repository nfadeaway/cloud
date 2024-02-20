import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloudContext } from '../../contexts/CloudContext.js'

import './Header.scss'

const Header = () => {

  const {isAuthenticated, setIsAuthenticated, serverError, setServerError, username, setUsername, userID, setUserID} = useContext(CloudContext)

  const logout = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_APP_SERVER_URL + '/api/logout/',
        {
          credentials: 'include'
        }
      )
      const statusCode = response.status
      const result = await response.json()
      console.log(result)
      if (statusCode === 200) {
        setIsAuthenticated(false)
        setUsername(false)
        setUserID(false)
      }
    } catch (error) {
      setServerError(error)
    }
  }

  return (
    <header className="header">
      <Link to="/"><div className="header__logo">CLOUD</div></Link>
      <nav className="header__nav">
        <ul className="header__nav-items">
          {!isAuthenticated &&
            <li className="header__nav-item"><Link to="/login">Войти</Link></li>
          }
          {isAuthenticated &&
            <>
              <li className="header__nav-item header__nav-item_username"><Link to="/dashboard">{username}</Link></li>
              <li className="header__nav-item" onClick={logout}>Выйти</li>
            </>
          }
        </ul>
      </nav>
    </header>
  )
}

export default Header