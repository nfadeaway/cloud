import './AdminPanel.scss'
import Uploader from '../uploader/Uploader.jsx'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'
import User from '../user/User.jsx'
import { useContext, useEffect } from 'react'
import { CloudContext } from '../../contexts/CloudContext.js'
import useRequest from '../../hooks/useRequest.jsx'

const AdminPanel = () => {

  const {updateDataFlag, setUpdateDataFlag, isAuthenticated, isAdmin} = useContext(CloudContext)
  const [dataUsers, loadingUsers, errorUsers, requestUsers] = useRequest()

  useEffect(() => {
    isAuthenticated && isAdmin && requestUsers(`/api/users/`, {credentials: 'include'})
  }, [])

  useEffect(() => {
    if (updateDataFlag) {
      requestUsers(`/api/users/`, {credentials: 'include'})
      setUpdateDataFlag(false)
    }
  }, [updateDataFlag])

  return (
    <section className="admin-panel-container">
      <div className="admin-panel-container__title">Пользователи системы</div>
      <div className="admin-panel-container__users">
        {/*{loadingUsers*/}
        {/*  ? <Loader/>*/}
        {/*  : errorUsers*/}
        {/*    ? <SystemMessage type="error" message="Ошибка связи с сервером"/>*/}
        {/*    : dataUsers.status && dataUsers.status === 200*/}
        {/*      ? dataUsers.result.map((user) => (<User key={user.id} user={user}/>))*/}
        {/*      : null*/}
        {/*}*/}
        {/*{dataUsers.result.map((user) => (<User key={user.id} user={user}/>))}*/}
      </div>
    </section>
  )
}

export default AdminPanel