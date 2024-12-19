import showToast from './toast'

const checkAuthToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return showToast('Authentication token is missing', 'destructive')
  } else {
    return true
  }
}

export default checkAuthToken
