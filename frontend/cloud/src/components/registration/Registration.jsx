import { Link } from 'react-router-dom'

import './Registration.scss'

const Registration = () => {
  return (
    <div className="registration-container">
      <div className="registration-container__form">
        <form className="registration-container__register-form">
          <input className="registration-container__username-input" type="text" placeholder="Имя пользователя"/>
          <input className="registration-container__password-input" type="password" placeholder="Пароль"/>
          <input className="registration-container__email-input" type="text" placeholder="E-mail"/>
          <button className="registration-container__button">Создать</button>
          <p className="registration-container__description">Уже зарегистрированы? <Link to="/login">Войти</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Registration