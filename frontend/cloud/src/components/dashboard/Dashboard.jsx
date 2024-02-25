import Uploader from '../uploader/Uploader.jsx'

import './Dashboard.scss'
import File from '../file/File.jsx'
import { useContext, useEffect } from 'react'
import { CloudContext } from '../../contexts/CloudContext.js'
import useRequest from '../../hooks/useRequest.jsx'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

const Dashboard = () => {

  const {userID, updateDataFlag, setUpdateDataFlag, isAuthenticated} = useContext(CloudContext)
  const [dataFiles, loadingFiles, errorFiles, requestFiles] = useRequest()

  useEffect(() => {
    if (isAuthenticated && userID) {
      requestFiles(`/api/files/`, {credentials: 'include'})
    }
  }, [])

  useEffect(() => {
    if (updateDataFlag) {
      requestFiles(`/api/files/`, {credentials: 'include'})
      setUpdateDataFlag(false)
    }
  }, [updateDataFlag])

  return (
    <section className="dashboard-container">
      <Uploader />
      <div className="dashboard-container__files">
        {loadingFiles
          ? <Loader />
          : errorFiles
            ? <SystemMessage type="error" message="Ошибка связи с сервером" />
            : dataFiles.status && dataFiles.status === 200
              ?
                dataFiles.result.length > 0
                  ? dataFiles.result.map((file) => (<File key={file.id} file={file} />))
                  : <div className="text">У вас еще нет файлов</div>
              : null
        }
      </div>
    </section>
  )
}

export default Dashboard