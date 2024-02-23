const getData = async (urlPostfix) => {
  let statusCode = undefined
  let data = undefined
  let error = null
  console.log('получаем данные')
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + urlPostfix,
      {
        credentials: 'include'
      }
    )
    statusCode = response.status
    data = await response.json()
  } catch (err) {
    error = err
  }

  return {responseStatusCode: statusCode, responseData: data, responseError: error}
}

export default getData