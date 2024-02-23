import { useContext, useState } from 'react'
import addIcon from '../../images/icons/add_icon.svg'
import getFileSize from '../../utils/getFileSize.js'

import './Uploader.scss'
import { CloudContext } from '../../contexts/CloudContext.js'
import getData from '../../utils/getData.js'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'
import getShortFilename from '../../utils/getFilename.js'

const Uploader = () => {

  const {serverError, setServerError, userID, setUpdateDataFlag} = useContext(CloudContext)

  const [fileData, setFileData] = useState(null)
  const [comment, setComment] = useState('')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const fileHandler = (e) => {
    console.log(e.target.files[0])
    setFileData(e.target.files[0])
  }

  const getCSRF = async () => {
    return await getData('/api/csrf/')
  }

  const uploadFile = async () => {
    setLoading(true)
    const { responseStatusCode, responseData, responseError } = await getCSRF()
    console.log('Получаем при аплоаде CSRF токен -', responseStatusCode, responseData, responseError)

    if (responseError) {
      console.log('ошибка CSRF', responseError)
      setLoading(false)
      setServerError(responseError)
      setTimeout(() => {
        setServerError(null)
      }, 2000)
    }

    if (responseStatusCode === 200) {
      try {
        let formData = new FormData()
        formData.append('content', fileData)
        formData.append('cloud_user', userID)
        formData.append('comment', comment)
        const response = await fetch(
          import.meta.env.VITE_APP_SERVER_URL + '/api/files/upload/',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'X-CSRFToken': responseData.csrf,
            },
            body: formData
          }
        )
        const statusCode = response.status
        const result = await response.json()
        setData({status: statusCode, result})
        console.log(result)
        if (statusCode === 201) {
          console.log('Устанавливаем данные флага обновления данных в true')
          setUpdateDataFlag(true)
        }
      } catch (error) {
        setServerError(error);
      } finally {
        setLoading(false)
        setTimeout(() => {
          setData({})
          setFileData(null)
          setServerError(null)
          setComment('')
        }, 2000)
      }
    }
  }

  return (
    <div className="upload-container">
      {!fileData
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
              {loading
                ? <Loader />
                : serverError
                  ? <SystemMessage type="error" message="Ошибка связи с сервером" />
                  : data.status && data.status === 201
                    ? <SystemMessage type="success" message="Файл загружен на сервер" />
                    : data.status && data.status === 400
                      ? <SystemMessage type="error" message={data.result.content[0]} />
                      :
                        <>
                          <div className="upload-container__file-info-area_top">
                            <div className="upload-container__file-info">
                              <div className="upload-container__filename">Имя файла: {getShortFilename(fileData.name, 50)}</div>
                              <div className="upload-container__filesize">Размер файла: {getFileSize(fileData.size)}</div>
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