import './File.scss'
import getFileSize from '../../utils/getFileSize.js'
import getTime from '../../utils/getTime.js'
import { useContext, useEffect, useRef, useState } from 'react'

import okIcon from '../../images/icons/ok_icon.svg'
import cancelIcon from '../../images/icons/cancel_icon.svg'
import successIcon from '../../images/icons/success_icon.svg'
import getData from '../../utils/getData.js'
import { CloudContext } from '../../contexts/CloudContext.js'

const File = (props) => {
  console.log(props)

  const {serverError, setServerError} = useContext(CloudContext)

  const [editFilenameFlag, setEditFilenameFlag] = useState(false)
  const [filename, setFilename] = useState('')
  const [loading, setLoading] = useState(false)

  const filenameInput = useRef(null)

  const editFilenameToggle = () => {
    setEditFilenameFlag(!editFilenameFlag)
  }

  const getCSRF = async () => {
    return await getData('/api/csrf/')
  }

  const updateFileInfo = async () => {
    setLoading(true)
    const { responseStatusCode, responseData, responseError } = await getCSRF()
    console.log('Получаем при апдейте файла CSRF токен -', responseStatusCode, responseData, responseError)

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

  useEffect(() => {
    editFilenameFlag && filenameInput.current.focus()
  }, [editFilenameFlag])

  return (
    <div className="file-container__file">
      <div className="file-container__top-area">
        <div className="file-container__file-name-area">
          <div className="filename-input-wrapper">
            {editFilenameFlag
              ? <input ref={filenameInput} data-id={props.file.id} type="text" value={filename} onChange={(e) => setFilename(e.target.value)}
                       className="file-container__file-name file-info input"/>
              : <div className="file-container__file-name file-info">{props.file.filename}</div>
            }
          </div>
          {!editFilenameFlag
            ? <button className="file-container__filename-edit-button button" onClick={editFilenameToggle}>Изменить</button>
            :
              <>
                <button className="file-container__filename-edit-button button button_ok" onClick={updateFileInfo}>
                  <img src={okIcon} alt="Иконка подтверждения" className="file-container__icon"/>
                </button>
                <button className="file-container__filename-edit-button button button_cancel" onClick={editFilenameToggle}>
                  <img src={cancelIcon} alt="Иконка отмены" className="file-container__icon"/>
                </button>
              </>
          }
        </div>
        <div className="file-container__file-comment file-info">{props.file.comment}</div>
        <div className="file-container__file-size file-info">{getFileSize(props.file.size)}</div>
        <div className="file-container__file-upload-date file-info">{getTime(props.file.date_uploaded)}</div>
        <div className="file-container__file-download-date file-info">{getTime(props.file.last_download)}</div>
        <div className="file-container__file-external-link file-info">{props.file.external_link_key}</div>
      </div>
      <div className="file-container__bottom-area">

      </div>
    </div>
  )
}

export default File