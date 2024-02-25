import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const ExternalFileDownload = () => {
  const location = useLocation()
  // const search = new URLSearchParams(location.search);
  // const param = search.get('paramName');

  useEffect(() => {
    console.log(location)
  }, [])

  return (
    <div>

    </div>
  )
}

export default ExternalFileDownload