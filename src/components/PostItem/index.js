import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'

import Cookies from 'js-cookie'

import SearchContext from '../../context/SearchContext'

import './index.css'

class PostItem extends Component {
  constructor(props) {
    super(props)
    const {details} = props

    this.state = {likeBtn: false, details}
  }

  onClickLike = async postId => {
    const {likeBtn} = this.state

    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    const {username, password} = this.context

    const userDetails = {username, password}
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (likeBtn) {
      this.onDislikeStatus(data)
    } else {
      this.onLikeStatus(data)
    }
    this.setState(prevState => ({likeBtn: !prevState.likeBtn}))

    console.log(response)
  }

  onLikeStatus = () => {
    const {details} = this.state
    this.setState({
      details: {...details, likesCount: details.likesCount + 1},
    })
  }

  onDislikeStatus = () => {
    const {details} = this.state
    this.setState({
      details: {...details, likesCount: details.likesCount - 1},
    })
  }

  render() {
    const {likeBtn, details} = this.state

    const {
      postDetails = {},
      userId,
      postId,
      profilePic,
      likesCount,
      userName,
      comments = [],
      createdAt,
    } = details

    return (
      <li className="post-container">
        <div className="profile-details">
          <img
            src={profilePic}
            className="profile-pic"
            alt="post author profile"
          />
          <Link to={`/users/${userId}`} className="link">
            <p>{userName}</p>
          </Link>
        </div>
        <img src={postDetails.image_url} className="post-img" alt="post" />
        <div className="post-content">
          <div>
            {likeBtn ? (
              <button
                type="button"
                data-testid="unLikeIcon"
                className="like-button"
                onClick={() => this.onClickLike(postId)}
              >
                <FcLike height={50} />
              </button>
            ) : (
              <button
                type="button"
                className="like-button"
                data-testid="likeIcon"
                onClick={() => this.onClickLike(postId)}
              >
                <BsHeart height={50} />
              </button>
            )}
            <button
              type="button"
              data-testid="commentIcon"
              className="like-button"
            >
              <FaRegComment height={50} />
            </button>
            <button
              type="button"
              data-testid="shareIcon"
              className="like-button"
            >
              <BiShareAlt height={50} />
            </button>
          </div>
          <p>{likesCount} likes</p>
          <p>{postDetails.caption}</p>
          <div>
            {comments.map(each => (
              <div className="comment-List" key={each.user_id}>
                <p>
                  <span className="comment-user">{each.user_name}</span>
                  {` `}
                  {each.comment}
                </p>
              </div>
            ))}
          </div>
          <p className="post-time">{createdAt}</p>
        </div>
      </li>
    )
  }
}

PostItem.contextType = SearchContext

export default PostItem
