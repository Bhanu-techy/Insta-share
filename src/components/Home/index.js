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
  static contextType = SearchContext

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
    const postData = await postResponse.json()
    console.log(postData)
    if (postResponse.ok) {
      this.setState({
        postState: stateConstants.success,
        postList: postData.posts,
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
    const data = await response.json()

    if (response.ok) {
      this.setState({
        storiesList: data.users_stories,
        storyState: stateConstants.success,
      })
    } else {
      this.setState({storyState: stateConstants.failure})
    }
  }

  onClickSearch = () => {
    this.setState({showContent: false})
  }

  renderPostsSuccessView = () => {
    const {postList} = this.state

    return (
      <ul className="post-bgcontainer">
        {postList.map(each => (
          <PostItem details={each} key={each.post_id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
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
    <div className="" testid="loader">
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
              <li key={each.user_id} className="story-container">
                <img
                  src={each.story_url}
                  alt="user story"
                  className="story-img"
                />
                <p className="stories-name">{each.user_name}</p>
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

export default Home
