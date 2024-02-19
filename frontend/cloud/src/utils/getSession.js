 const getSession = async () => {

  let sessionAuth = false
  let sessionError = null

  console.log('проверяем сессию')
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + '/api/session/',
      {
        credentials: 'include'
      }
    )
    const statusCode = response.status
    sessionAuth = statusCode === 200
  } catch (error) {
    sessionError = error
  }

  return {sessionAuth, sessionError}
}

export default getSession