import {Component} from 'react'
import Cookies from 'js-cookie'
import SearchContext from '../../context/SearchContext'
import './index.css'

class Login extends Component {
  static contextType = SearchContext

  state = {showSubmitErr: false, errMsg: ''}

  submitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitErrorMsg = errMsg => {
    this.setState({showSubmitErr: true, errMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.context

    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitErrorMsg(data.error_msg)
    }
  }

  render() {
    const {showSubmitErr, errMsg} = this.state

    return (
      <SearchContext.Consumer>
        {value => {
          const {onChangeName, onChangePassword, username, password} = value
          return (
            <div className="login-container">
              <div className="login-img-container">
                <img
                  src="https://res.cloudinary.com/dya0bwju7/image/upload/v1749728287/Illustration_qpy0ly.png"
                  className="login-image"
                  alt="website login"
                />
              </div>
              <form className="login-form-container" onSubmit={this.submitForm}>
                <div className="login-logo-containter">
                  <img
                    src="https://res.cloudinary.com/dya0bwju7/image/upload/v1749788026/Standard_Collection_8_ujpfzk.png"
                    alt="website logo"
                    className="logo"
                  />
                  <h1 className="login-heading">Insta share</h1>
                </div>
                <div className="input-container">
                  <label htmlFor="username">USERNAME</label>
                  <input
                    id="username"
                    type="text"
                    className="login-input"
                    value={username}
                    onChange={onChangeName}
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="password">PASSWORD</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    className="login-input"
                    onChange={onChangePassword}
                  />
                  {showSubmitErr && <p className="error-msg">{errMsg}</p>}
                </div>

                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default Login
