import { useContext, useEffect, useState } from 'react'
import addIcon from '../../images/icons/add_icon.svg'
import getFileSize from '../../utils/getFileSize.js'
import './Uploader.scss'
import { CloudContext } from '../../contexts/CloudContext.js'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'
import getShortFilename from '../../utils/getFilename.js'
import useRequest from '../../hooks/useRequest.jsx'

const Uploader = () => {

  const {userID, setUpdateDataFlag} = useContext(CloudContext)

  const [file, setFile] = useState(null)
  const [comment, setComment] = useState('')
  const [dataCSRF, loadingCSRF, errorCSRF, requestCSRF] = useRequest()
  const [dataUpload, loadingUpload, errorUpload, requestUpload] = useRequest('uploader')

  const fileHandler = (e) => {
    setFile(e.target.files[0])
  }

  const uploadFile = async () => {

    let formData = new FormData()
    formData.append('content', file)
    formData.append('cloud_user', userID)
    formData.append('comment', comment)

    const init = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': dataCSRF.result.csrf
      },
      body: formData
    }
    await requestUpload('/api/files/upload/', init)
  }

  useEffect(() => {
    if (!dataCSRF.result) {
      console.log('запрос CSRF из Аплоадера')
      requestCSRF('/api/csrf/', {credentials: 'include'})
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      dataUpload.status === 201 && setUpdateDataFlag(true)
      setFile(null)
      setComment('')
    }, 2000)
  }, [dataUpload])

  return (
    <div className="upload-container">
      {!file
        ?
          <>
            <label htmlFor="upload-container__file-input">
              <div className="upload-container__add-file-area">
                <input type="file" id="upload-container__file-input" onChange={fileHandler}/>
                <img src={addIcon} alt="Иконка добавления файла" className="upload-container__add-file-icon"/>
              </div>
            </label>
          </>
        :
          <>
            <div className="upload-container__file-info-area">
              {loadingUpload
                ? <Loader />
                : errorUpload
                  ? <SystemMessage type="error" message="Ошибка связи с сервером" />
                  : dataUpload.status && dataUpload.status === 201
                    ? <SystemMessage type="success" message="Файл загружен на сервер" />
                    : dataUpload.status && dataUpload.status === 400
                      ? <SystemMessage type="error" message={dataUpload.result.content[0]} />
                      :
                        <>
                          <div className="upload-container__file-info-area_top">
                            <div className="upload-container__file-info">
                              <div className="upload-container__filename">Имя файла: {getShortFilename(file.name, 50)}</div>
                              <div className="upload-container__filesize">Размер файла: {getFileSize(file.size)}</div>
                            </div>
                            <button className="upload-container__button button" onClick={uploadFile}>Отправить</button>
                          </div>
                          <input onChange={(e) => setComment(e.target.value)} value={comment} className="upload-container__comment-input input" type="text"
                                 placeholder="Комментарий к файлу"/>
                        </>
              }
            </div>
          </>
      }
    </div>
  )
}

export default Uploader