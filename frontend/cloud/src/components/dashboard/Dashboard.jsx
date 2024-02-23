import Uploader from '../uploader/Uploader.jsx'

import './Dashboard.scss'
import File from '../file/File.jsx'
import { useContext, useEffect, useState } from 'react'
import { CloudContext } from '../../contexts/CloudContext.js'
import getData from '../../utils/getData.js'

const Dashboard = () => {

  const {serverError, setServerError, userID, updateDataFlag, setUpdateDataFlag, isAuthenticated} = useContext(CloudContext)

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const getFiles = async () => {
      if (isAuthenticated && userID) {
        setLoading(true)
        console.log('Пользователь:', userID, isAuthenticated)
        console.log('Качаем данные о файлах пользователя')
        const { responseStatusCode, responseData, responseError } = await getData(`/api/files/`)
        console.log(responseStatusCode, responseData, responseError)

        if (responseError) {
          setLoading(false)
          setServerError(responseError)
          setTimeout(() => {
            setServerError(null)
          }, 2000)
        }

        if (responseStatusCode === 200) {
          console.log('Данные получены')
          console.log(responseStatusCode, responseData, responseError)
          setServerError(responseError)
          setData({status: responseStatusCode, files: responseData})
          console.log('data', data)
        }
      }
    }

    getFiles()
  }, [])

  return (
    <section className="dashboard-container">
      <Uploader />
      {data.status && data.status === 200 &&
        <>
          <div className="dashboard-container__files">
          {data.files.map((file) => (
            <File key={file.id} file={file} />
          ))}
          </div>
        </>
      }
    </section>
  )
}

export default Dashboard