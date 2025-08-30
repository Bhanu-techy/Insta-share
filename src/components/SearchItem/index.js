import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'
import Cookies from 'js-cookie'
import SearchContext from '../../context/SearchContext'
import './index.css'

class SearchItem extends Component {
  constructor(props) {
    super(props)

    const {result} = props

    this.state = {result, likeBtn: false}
  }

  onClickLike = async postId => {
    const {likeBtn, result} = this.state
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
      data.like_status = false
      data.message = 'Post has been liked'
      this.setState({
        result: {...result, likesCount: result.likesCount - 1},
      })
    } else {
      data.like_status = true
      this.setState({
        result: {...result, likesCount: result.likesCount + 1},
      })
    }
    this.setState(prevState => ({likeBtn: !prevState.likeBtn}))

    console.log(data)
  }

  render() {
    const {likeBtn, result} = this.state
    const {
      postDetails = {},
      userId,
      postId,
      profilePic,
      likesCount,
      userName,
      comments = [],
      createdAt,
    } = result

    return (
      <li className="post-container link">
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
                testid="unLikeIcon"
                className="like-button"
                onClick={() => this.onClickLike(postId)}
              >
                <FcLike height={50} />
              </button>
            ) : (
              <button
                type="button"
                className="like-button"
                testid="likeIcon"
                onClick={() => this.onClickLike(postId)}
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
          <p>{likesCount} likes</p>
          <p>{postDetails.caption}</p>
          <div>
            {comments.map(each => (
              <div className="comment-List" id={each.user_d}>
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

SearchItem.contextType = SearchContext

export default SearchItem
