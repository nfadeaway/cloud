import { useContext, useRef, useState } from 'react'
import addIcon from '../../images/icons/add_icon.svg'
import getFileSize from '../../utils/getFileSize.js'

import './Uploader.scss'
import { CloudContext } from '../../contexts/CloudContext.js'

const Uploader = () => {

  const {serverError, setServerError} = useContext(CloudContext)

  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false)

  const commentInput = useRef(null)

  const fileHandler = (e) => {
    console.log(e.target.files[0])
    setFileData(e.target.files[0])
  }

  const uploadFile = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        import.meta.env.VITE_APP_SERVER_URL + '/api/files/upload/',
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
            <div className="upload-container__file-info-area_top">
              <div className="upload-container__file-info">
                <div className="upload-container__filename">Имя файла: {fileData.name}</div>
                <div className="upload-container__filesize">Размер файла: {getFileSize(fileData.size)}</div>
              </div>
              <button className="upload-container__button" onClick={uploadFile}>Отправить</button>
            </div>
            <input ref={commentInput} className="upload-container__comment-input" type="text"
                   placeholder="Комментарий к файлу"/>
          </div>
        </>
      }
    </div>
  )
}

export default Uploader