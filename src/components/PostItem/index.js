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
  static contextType = SearchContext

  state = {likeBtn: false, details: this.props.details}

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

  onLikeStatus = data => {
    const {details} = this.state
    data.like_status = true
    this.setState({
      details: {...details, likes_count: details.likes_count + 1},
    })
  }

  onDislikeStatus = data => {
    const {details} = this.state
    data.like_status = false
    this.setState({
      details: {...details, likes_count: details.likes_count - 1},
    })
  }

  render() {
    const {likeBtn, details} = this.state

    const {
      post_details = {},
      user_id,
      post_id,
      profile_pic,
      likes_count,
      user_name,
      comments = [],
      created_at,
    } = details

    return (
      <li className="post-container">
        <div className="profile-details">
          <img
            src={profile_pic}
            className="profile-pic"
            alt="post author profile"
          />
          <Link to={`/users/${user_id}`}>
            <p>{user_name}</p>
          </Link>
        </div>
        <img src={post_details.image_url} className="post-img" alt="post" />
        <div className="post-content">
          <div>
            {likeBtn ? (
              <button
                type="button"
                testid="unLikeIcon"
                className="like-button"
                onClick={() => this.onClickLike(post_id)}
              >
                <FcLike height={50} />
              </button>
            ) : (
              <button
                type="button"
                className="like-button"
                testid="likeIcon"
                onClick={() => this.onClickLike(post_id)}
              >
                <BsHeart height={50} />
              </button>
            )}
            <button type="button" testid="commentIcon" className="like-button">
              <FaRegComment height={50} />
            </button>
            <button type="button" testid="shareIcon" className="like-button">
              <BiShareAlt height={50} />
            </button>
          </div>
          <p>{likes_count} likes</p>
          <p>{post_details.caption}</p>
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
          <p className="post-time">{created_at}</p>
        </div>
      </li>
    )
  }
}

export default PostItem
