import { useState } from 'react'

const useDownloadFile = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (url, init) => {
    console.log('скачиваем файл')
    setLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_APP_SERVER_URL + url, init)
      const headers = Object.fromEntries(response.headers.entries())
      console.log(headers)
      const statusCode = response.status
      if (response.status === 200) {
        const result = await response.blob()
        const url = window.URL.createObjectURL(new Blob([result]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', headers.filename)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      }
      setData({status: statusCode})
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
      setTimeout(() => {
        setError(null)
      }, 2000)
    }
  }

  return [data, loading, error, request]
}

export default useDownloadFile