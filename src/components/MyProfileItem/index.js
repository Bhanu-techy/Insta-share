import {BiCamera} from 'react-icons/bi'
import {BsGrid3X3} from 'react-icons/bs'

import './index.css'

const ProfileView = props => {
  const {details} = props
  const {
    user_name,
    user_id,
    user_bio,
    posts_count,
    followers_count,
    following_count,
    profile_pic,
  } = details

  const {stories = [], posts = []} = details

  const nopostview = posts_count === 0 ? 'nopostviewcss' : ''
  const postview = posts_count > 0 ? 'nopostviewcss' : ''

  return (
    <div className="profile-bgcontainer">
      <div className="profile-container">
        <div className="bio-container">
          <div className="profile-pic-container">
            <img src={profile_pic} className="profile_pic" alt="my profile" />
          </div>
          <div>
            <h1 className="username">{user_name}</h1>
            <div className="bio-details">
              <p>
                <span className="count">{posts_count}</span> posts
              </p>
              <p>
                <span className="count">{followers_count}</span> followers
              </p>
              <p>
                <span className="count">{following_count}</span> following
              </p>
            </div>
            <p className="user-id">{user_id}</p>
            <p className="bio">{user_bio}</p>
          </div>
        </div>

        <div>
          <ul className="highlight-div">
            {stories.map(each => (
              <li key={each.id}>
                <img
                  src={each.image}
                  alt="my story"
                  className="highlight-img"
                />
              </li>
            ))}
          </ul>
        </div>
        <hr className="profile-line" />
        <div>
          <div className="post-icon">
            <BsGrid3X3 />
            <p className="posts">Posts</p>
          </div>
        </div>
        <div className="profile-post-bgcontainer">
          <div className={`no-post-div ${postview} `}>
            <BiCamera className="bicamera-icon" />
            <h1>No Posts Yet</h1>
          </div>

          <ul className={`profile-post-container ${nopostview}`}>
            {posts.map(post => (
              <li key={post.id}>
                <img src={post.image} className="profile-posts" alt="my post" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
