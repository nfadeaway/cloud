import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { CloudContext } from '../../contexts/CloudContext'

import './Login.scss'
import getCSRFToken from '../../utils/getCSRFToken'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'


const Login = () => {

  const {isAuthenticated, setIsAuthenticated, serverError, setServerError} = useContext(CloudContext)

  const usernameInput = useRef(null)
  const passwordInput = useRef(null)
  const loginInvalidDiv = useRef(null)

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()



  const checkSession = async () => {
    const { sessionAuth, sessionError } = await getSession()
    console.log({sessionAuth, sessionError})
    if (sessionAuth) {
      setIsAuthenticated(true)
    }
    sessionError && setServerError(true)
  }

  const checkCSRF = async () => {
    // const { CSRFToken, CSRFError } = await getCSRFToken()
    // console.log({CSRFToken, CSRFError})
    return await getCSRFToken()
  }

  const loginUserRequest = async (e) => {
    e.preventDefault()

    const { CSRFToken, CSRFError } = await checkCSRF()
    console.log(CSRFToken, CSRFError)
    if (!CSRFError && CSRFToken) {
      setLoading(true)
      try {
        const response = await fetch(
          import.meta.env.VITE_APP_SERVER_URL + '/api/login/',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': CSRFToken,
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
    console.log('провераем на странице Login, есть ли уже авторизация')
    isAuthenticated && navigate('/dashboard')
  }, [])

  return (
    <div className="login-container">
      <div className="login-container__form">
        <form className="login-container__login-form" onSubmit={loginUserRequest}>
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
    </div>
  )
}

export default Login