const getCSRFToken = async () => {

  let CSRFToken = ''
  let CSRFError = null

  console.log('получаем CSRF')
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + '/api/csrf/',
      {
        credentials: 'include'
      }
    )
    const statusCode = response.status
    const result = await response.json()
    CSRFToken = statusCode === 200 ? result.csrf : ''
  } catch (error) {
    CSRFError = error
  }

  return {CSRFToken, CSRFError}
}

export default getCSRFToken