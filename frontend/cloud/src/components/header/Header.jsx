import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloudContext } from '../../contexts/CloudContext.js'

import './Header.scss'

const Header = () => {

  const {isAuthenticated, setIsAuthenticated, serverError, setServerError} = useContext(CloudContext)

  return (
    <header className="header">
      <div className="header__logo">
        CLOUD
      </div>
      <nav className="header__nav">
        <ul className="header__nav-items">
          <li className="header__nav-item"><Link to="/login">Войти</Link></li>
          <li className="header__nav-item">Выйти</li>
        </ul>
      </nav>
    </header>
  )
}

export default Header