import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { CloudContext } from '../../contexts/CloudContext'

import './Login.scss'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'
import getData from '../../utils/getData.js'


const Login = () => {

  const {isAuthenticated, setIsAuthenticated, serverError, setServerError, setUsername, setUserID} = useContext(CloudContext)

  const usernameInput = useRef(null)
  const passwordInput = useRef(null)
  const loginInvalidDiv = useRef(null)

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const getCSRF = async () => {
    return await getData('/api/csrf/')
  }

  const login = async (e) => {
    e.preventDefault()

    const { statusCode, data, error } = await getCSRF()
    console.log('Получаем при логине CSRF токен -', statusCode, data, error)
    if (statusCode === 200) {
      setLoading(true)
      try {
        const response = await fetch(
          import.meta.env.VITE_APP_SERVER_URL + '/api/login/',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': data.csrf,
            },
            body: JSON.stringify(
              {
                username: usernameInput.current.value,
                password: passwordInput.current.value,
              }
            )
          }
        )
        const statusCode = response.status
        const result = await response.json()
        setData({status: statusCode, result})
        console.log(result)
        if (statusCode === 200) {
          console.log('Устанавливаем данные пользователя в Login', result.username, result.userID)
          setUsername(result.username)
          setUserID(result.userID)
        }
      } catch (error) {
        setServerError(error);
        setTimeout(() => {
          setServerError(null)
        }, 2000)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (data.status === 400) {
      data.result.detail && loginInvalidDiv.current.classList.remove('hidden')
    } else if (data.status === 200) {
      setTimeout(() => {
        setIsAuthenticated(true)
        navigate('/dashboard')
      }, 2000)
    }
  }, [data])

  useEffect(() => {
    console.log('Проверяем на странице Login, есть ли уже авторизация -', isAuthenticated)
    isAuthenticated && navigate('/dashboard')
  }, [isAuthenticated])

  return (
    <section className="login-container">
      <div className="login-container__form">
        <form className="login-container__login-form" onSubmit={login}>
          {loading
            ? <Loader />
            : serverError
              ? <SystemMessage type="error" message="Ошибка связи с сервером" />
              : data.status && data.status === 200
                ? <SystemMessage type="success" message='Успешный вход в систему' />
                : (
                  <>
                    <input ref={usernameInput} className="login-container__username-input" type="text"
                           placeholder="Имя пользователя" autoComplete="username" required/>
                    <input ref={passwordInput} className="login-container__password-input" type="password" placeholder="Пароль"
                           autoComplete="current-password" required/>
                    <div ref={loginInvalidDiv} className="login-container__login-invalid hidden">
                      {data.status === 400 && data.result.detail}
                    </div>
                    <button className="login-container__button" type="submit">Войти</button>
                    <p className="login-container__description">Не зарегистрированы? <Link
                      to="/registration">Зарегистрироваться</Link></p>
                  </>
                )
          }
        </form>
      </div>
    </section>
  )
}

export default Login