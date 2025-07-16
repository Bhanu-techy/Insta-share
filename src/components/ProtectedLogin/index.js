import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedLogin = props => {
  const token = Cookies.get('jwt_token')
  if (token !== undefined) {
    return <Redirect to="/" />
  }
  return <Route {...props} />
}

export default ProtectedLogin
