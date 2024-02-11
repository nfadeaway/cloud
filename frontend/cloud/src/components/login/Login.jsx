import { Link } from 'react-router-dom'

import './Login.scss'

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-container__form">
        <form className="login-container__login-form">
          <input className="login-container__username-input" type="text" placeholder="Имя пользователя"/>
          <input className="login-container__password-input" type="password" placeholder="Пароль"/>
          <button className="login-container__button">Войти</button>
          <p className="login-container__description">Не зарегистрированы? <Link to="/registration">Зарегистрироваться</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login