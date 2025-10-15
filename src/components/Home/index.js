import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Slider from 'react-slick'

import SearchContext from '../../context/SearchContext'
import PostItem from '../PostItem'

import Header from '../Header'

import './index.css'

const stateConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'LOADING',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {
    storiesList: [],
    postList: [],
    searchPostList: [],
    storyState: stateConstants.initial,
    postState: stateConstants.initial,
  }

  componentDidMount() {
    this.getStories()
    this.getPosts()
    const {onRefreshHomePage} = this.context
    onRefreshHomePage()
  }

  getPosts = async () => {
    this.setState({postState: stateConstants.in_progress})

    const posturl = 'https://apis.ccbp.in/insta-share/posts'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const postResponse = await fetch(posturl, options)

    if (postResponse.ok) {
      const postData = await postResponse.json()

      const postList = postData.posts.map(each => ({
        postId: each.post_id,
        userId: each.user_id,
        userName: each.user_name,
        profilePic: each.profile_pic,
        postDetails: each.post_details,
        likesCount: each.likes_count,
        comments: each.comments,
        createdAt: each.created_at,
      }))

      this.setState({
        postState: stateConstants.success,
        postList,
      })
    } else {
      this.setState({postState: stateConstants.failure})
    }
  }

  getStories = async () => {
    this.setState({storyState: stateConstants.in_progress})

    const url = 'https://apis.ccbp.in/insta-share/stories'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const stories = data.users_stories.map(each => ({
        userId: each.user_id,
        userName: each.user_name,
        storyUrl: each.story_url,
      }))

      this.setState({
        storiesList: stories,
        storyState: stateConstants.success,
      })
    } else {
      this.setState({storyState: stateConstants.failure})
    }
  }

  renderPostsSuccessView = () => {
    const {postList} = this.state

    return (
      <ul className="post-bgcontainer">
        {postList.map(each => (
          <PostItem details={each} key={each.postId} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dsqphsoxb/image/upload/v1751650133/failureView_po4xd8.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.getPosts}>
        Try again
      </button>
    </div>
  )

  renderStoryFailureView = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dsqphsoxb/image/upload/v1751650133/failureView_po4xd8.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.getStories}>
        Try again
      </button>
    </div>
  )

  renderStoryLoadingView = () => (
    <div className="" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderStorySuccessView = () => {
    const {storiesList} = this.state
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
    }

    return (
      <>
        <ul className="slider-container-md">
          <Slider {...settings}>
            {storiesList.map(each => (
              <li key={each.userId} className="story-container">
                <img
                  src={each.storyUrl}
                  alt="user story"
                  className="story-img"
                />
                <p className="stories-name">{each.userName}</p>
              </li>
            ))}
          </Slider>
        </ul>
      </>
    )
  }

  renderStoryResultView = () => {
    const {storyState} = this.state

    switch (storyState) {
      case stateConstants.success:
        return this.renderStorySuccessView()
      case stateConstants.failure:
        return this.renderStoryFailureView()
      case stateConstants.in_progress:
        return this.renderStoryLoadingView()
      default:
        return null
    }
  }

  renderPostResultView = () => {
    const {postState} = this.state

    switch (postState) {
      case stateConstants.success:
        return this.renderPostsSuccessView()
      case stateConstants.failure:
        return this.renderFailureView()
      case stateConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchPostList} = this.state
    return (
      <SearchContext.Consumer>
        {value => {
          const {showHomePage} = value
          return (
            <div className="home-container">
              <Header homenavcss="activenav" profilenavcss="" />
              {showHomePage && (
                <div className="homecontainer">
                  <hr className="line" />
                  {searchPostList.length === 0 ? (
                    <div className="main-container">
                      {this.renderStoryResultView()}
                      {this.renderPostResultView()}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

Home.contextType = SearchContext

export default Home
