import { useState } from 'react'

const useRequest = (mode) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, init) => {
    console.log('запуск')
    setLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_APP_SERVER_URL + url, init)
      console.log(response)
      const statusCode = response.status
      if (mode === 'delete') {
        setData({status: response.status})
      } else {
        const result = await response.json()
        setData({status: response.status, result})
        console.log({status: statusCode, result})
        setTimeout(() => {
          mode === 'uploader' && setData({})
          !response.ok && setData({})
        }, 2000)
      }
    } catch (error) {
      setTimeout(() => {
        setError(null)
      }, 2000)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return [data, loading, error, request]
}

export default useRequest