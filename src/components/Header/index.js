import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import SearchItem from '../SearchItem'
import SearchContext from '../../context/SearchContext'

import './index.css'

const stateConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'LOADING',
  initial: 'INITIAL',
}

class Header extends Component {
  state = {
    shownavItems: false,
    postState: stateConstants.initial,
    searchInput: '',
    postList: [],
  }

  onClickSearchBtn = async () => {
    const {searchInput} = this.state

    const {onClickSearch} = this.context
    onClickSearch()

    this.setState({postState: stateConstants.in_progress})

    const posturl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
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

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickHamberger = () => {
    this.setState({shownavItems: true})
  }

  onClickCloseHamberger = () => {
    this.setState({shownavItems: false})
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  renderSuccessSearchList = () => {
    const {postList} = this.state

    return postList.length !== 0 ? (
      <ul className='post-bgcontainer'>
        <h1>Search Results</h1>
        {postList.map(each => (
          <SearchItem result={each} key={each.postId} />
        ))}
      </ul>
    ) : (
      this.renderEmptyView()
    )
  }

  renderFailureSearchList = () => (
    <div>
      <img
        src='https://res.cloudinary.com/dsqphsoxb/image/upload/v1751650133/failureView_po4xd8.png'
        alt='failure view'
      />
      <p>Something went wrong. Please try again</p>
      <button type='button' onClick={this.onClickSearchBtn}>
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='TailSpin' color='#4094EF' height={50} width={50} />
    </div>
  )

  renderSearchListResult = () => {
    const {postState} = this.state

    switch (postState) {
      case stateConstants.success:
        return this.renderSuccessSearchList()
      case stateConstants.failure:
        return this.renderFailureSearchList()
      case stateConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderEmptyView = () => (
    <div className='searchResult-empty-view-container'>
      <img
        src='https://res.cloudinary.com/dsqphsoxb/image/upload/v1751541232/Group_yrozgm.png'
        alt='search not found'
        className='searchResult-empty-img'
      />
      <h1 className='searchResult-empty-head'>Search Not Found</h1>
      <p>Try different keyword or search again</p>
    </div>
  )

  render() {
    const {shownavItems, searchInput} = this.state
    const {homenavcss, profilenavcss} = this.props
    return (
      <SearchContext.Consumer>
        {value => {
          const {showHomePage} = value
          const navsmall = shownavItems ? 'nav-container-sm' : ''
          const navshowsm = shownavItems ? 'navshow' : 'navhide'
          const searchbarsm = shownavItems ? 'navhide' : 'searchshow'

          return (
            <>
              <nav className='navbar'>
                <div className={`nav-container ${navsmall}`}>
                  <div className='logo-div'>
                    <div className='logo-and-title'>
                      <Link to='/'>
                        <img
                          src='https://res.cloudinary.com/dya0bwju7/image/upload/v1749788026/Standard_Collection_8_ujpfzk.png'
                          alt='website logo'
                          className='nav-logo'
                        />
                      </Link>
                      <h1 className='website-title'>Insta Share</h1>
                    </div>
                    <div>
                      <button
                        type='button'
                        onClick={this.onClickHamberger}
                        className='popup'
                      >
                        <img
                          src='https://res.cloudinary.com/dsqphsoxb/image/upload/v1751720351/menu_x8id77.png'
                          alt='hamberger'
                        />
                      </button>
                    </div>
                  </div>
                  <ul className='nav-list'>
                    <li className={`searchbar ${searchbarsm}`}>
                      <input
                        type='search'
                        placeholder='Search Caption'
                        value={searchInput}
                        onChange={this.onSearchInput}
                      />
                      <button
                        type='button'
                        className='search-icon'
                        data-testid='searchIcon'
                        onClick={this.onClickSearchBtn}
                      >
                        <FaSearch />
                      </button>
                    </li>
                    <Link to='/' className='link'>
                      <li className={`nav-item ${homenavcss} ${navshowsm}`}>
                        Home
                      </li>
                    </Link>
                    <Link to='/my-profile' className='link'>
                      <li className={`nav-item ${profilenavcss} ${navshowsm}`}>
                        Profile
                      </li>
                    </Link>
                    <li className={`nav-item ${navshowsm}`}>
                      <button type='button' onClick={this.onClickLogout}>
                        Logout
                      </button>
                    </li>
                    <li className={`nav-item ${navshowsm} cancelbtn`}>
                      <button
                        type='button'
                        onClick={this.onClickCloseHamberger}
                      >
                        x
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
              <div className='home-container'>
                {!showHomePage && this.renderSearchListResult()}
              </div>
            </>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

Header.contextType = SearchContext

export default withRouter(Header)
