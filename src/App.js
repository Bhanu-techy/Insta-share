import {Switch, Route, Redirect} from 'react-router-dom'
import {Component} from 'react'
import Login from './components/Login'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import UserProfile from './components/Userprofile'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedLogin from './components/ProtectedLogin'
import SearchContext from './context/SearchContext'

import './App.css'

class App extends Component {
  state = {showHomePage: true, username: '', password: ''}

  onClickSearch = () => {
    this.setState({showHomePage: false})
  }

  onRefreshHomePage = () => {
    this.setState({showHomePage: true})
  }

  onChangeName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showHomePage, username, password} = this.state
    return (
      <SearchContext.Provider
        value={{
          showHomePage,
          onClickSearch: this.onClickSearch,
          onChangeName: this.onChangeName,
          onChangePassword: this.onChangePassword,
          onRefreshHomePage: this.onRefreshHomePage,
          username,
          password,
        }}
      >
        <Switch>
          <ProtectedLogin exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <Route path="/bad-path" component={NotFound} />
          <Redirect to="bad-path" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
