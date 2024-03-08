import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useDownloadFile from '../../hooks/useDownloadFile.jsx'

import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import './ExternalFileDownload.scss'

const ExternalFileDownload = () => {
  // const location = useLocation()
  const navigate = useNavigate()
  // const [dataDownloadFile, loadingDownloadFile, errorDownloadFile, requestDownloadFile] = useDownloadFile()

  // const downloadFile = async () => {
  //   await requestDownloadFile(location.pathname, {credentials: 'include'})
  // }

  // useEffect(() => {
  //   !dataDownloadFile.status && downloadFile()
  // }, [])

  return (
    <div className="external-download-container">
      <div className="external-download-container__file">
        {/*{loadingDownloadFile*/}
        {/*  ? <Loader/>*/}
        {/*  : errorDownloadFile*/}
        {/*    ? <SystemMessage type="error" message="Ошибка связи с сервером"/>*/}
        {/*    : dataDownloadFile.status && dataDownloadFile.status === 200*/}
        {/*      ?*/}
        {/*        <>*/}
        {/*          <div className="external-download-container__download-success">Загрузка начнётся автоматически... Благодарим за*/}
        {/*          использование нашего сервиса.</div>*/}
        {/*         <div className="button" onClick={() => navigate('/')}>На главную</div>*/}
        {/*        </>*/}
        {/*      :*/}
        {/*        <>*/}
                  <div className="external-download-container__download-error">Данный файл не найден в системе.</div>
                  <div className="button" onClick={() => navigate('/')}>На главную</div>
                {/*</>*/}
        {/*}*/}
      </div>
    </div>
  )
}

export default ExternalFileDownload