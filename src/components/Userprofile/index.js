import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import UserProfileItem from '../UserProfileItem'

import './index.css'

const stateConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'LOADING',
  initial: 'INITIAL',
}

class Userprofile extends Component {
  state = {userDetails: {}, state: stateConstants.initial}

  componentDidMount() {
    this.getUserProfile()
  }

  getUserProfile = async () => {
    this.setState({state: stateConstants.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const user = data.user_details

      const details = {
        userName: user.user_name,
        userId: user.user_id,
        userBio: user.user_bio,
        postsCount: user.posts_count,
        followersCount: user.followers_count,
        followingCount: user.following_count,
        profilePic: user.profile_pic,
        stories: user.stories,
        posts: user.posts,
      }
      this.setState({
        userDetails: details,
        state: stateConstants.success,
      })
    } else {
      this.setState({state: stateConstants.failure})
    }
  }

  renderProfileView = () => {
    const {userDetails} = this.state

    return (
      <div>
        <UserProfileItem details={userDetails} />
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="profile-loader" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/dsqphsoxb/image/upload/v1751650133/failureView_po4xd8.png"
        alt="failure view"
        className="failure-view-img"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.getUserProfile}>
        Try again
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {state} = this.state

    switch (state) {
      case stateConstants.success:
        return this.renderProfileView()
      case stateConstants.failure:
        return this.renderFailureView()
      case stateConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header homenavcss="" profilenavcss="" />
        {this.renderProfileSuccessView()}
      </div>
    )
  }
}

export default Userprofile
