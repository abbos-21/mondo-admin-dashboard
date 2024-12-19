const checkIfUserIsAuthenticated = () => {
  if (localStorage.getItem('token')) {
    return true
  } else {
    return false
  }
}

const checkIfUserIsAdmin = () => {
  if (localStorage.getItem('isAdmin') && localStorage.getItem('isAdmin') === 'true') {
    return true
  } else {
    return false
  }
}

export default { checkIfUserIsAuthenticated, checkIfUserIsAdmin }
