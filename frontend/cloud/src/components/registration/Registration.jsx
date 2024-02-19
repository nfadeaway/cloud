import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './Registration.scss'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'
import Loader from '../common/Loader/Loader.jsx'

import { CloudContext } from '../../contexts/CloudContext.js'

const Registration = () => {

  const {serverError, setServerError} = useContext(CloudContext)

  const usernameInput = useRef(null)
  const passwordInput = useRef(null)
  const emailInput = useRef(null)

  const usernameInvalidDiv = useRef(null)
  const passwordInvalidDiv = useRef(null)
  const emailInvalidDiv = useRef(null)

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const createUserRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(
        import.meta.env.VITE_APP_SERVER_URL + '/api/users/registration/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              username: usernameInput.current.value,
              password: passwordInput.current.value,
              email: emailInput.current.value
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

  useEffect(() => {
    if (data.status === 400) {
      data.result.username && usernameInvalidDiv.current.classList.remove('hidden')
      data.result.password && passwordInvalidDiv.current.classList.remove('hidden')
      data.result.email && emailInvalidDiv.current.classList.remove('hidden')
    } else if (data.status === 201) {
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }, [data])

  return (
    <>
      <div className="registration-container">
        <div className="registration-container__form">
          <form className="registration-container__register-form" onSubmit={createUserRequest}>
            {loading
              ? <Loader />
              : serverError
                ? <SystemMessage type="error" message="Ошибка связи с сервером" />
                : data.status && data.status === 201
                  ? <SystemMessage type="success" message="Успешная регистрация" />
                  : (
                    <>
                      <input ref={usernameInput} className="registration-container__username-input" type="text"
                             placeholder="Имя пользователя" autoComplete="username" required />
                      <div ref={usernameInvalidDiv} className="registration-container__username-invalid hidden">
                        {data.status === 400 && data.result.username && data.result.username[0]}
                      </div>
                      <input ref={passwordInput} className="registration-container__password-input" type="password"
                             placeholder="Пароль" autoComplete="new-password" required />
                      <div ref={passwordInvalidDiv} className="registration-container__password-invalid hidden">
                        {data.status === 400 && data.result.password && data.result.password[0]}
                      </div>
                      <input ref={emailInput} className="registration-container__email" type="text"
                             placeholder="E-mail" required />
                      <div ref={emailInvalidDiv} className="registration-container__email-invalid hidden">
                        {data.status === 400 && data.result.email && data.result.email[0]}
                      </div>
                      <button className="registration-container__button" type="submit">Создать</button>
                      <p className="registration-container__description">Уже зарегистрированы? <Link
                        to="/login">Войти</Link></p>
                    </>
                  )
            }
          </form>
        </div>
      </div>
    </>
  )
}

export default Registration