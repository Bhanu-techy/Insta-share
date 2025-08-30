import {BiCamera} from 'react-icons/bi'
import {BsGrid3X3} from 'react-icons/bs'

import './index.css'

const ProfileView = props => {
  const {details} = props
  const {
    userName,
    userId,
    userBio,
    postsCount,
    followersCount,
    followingCount,
    profilePic,
  } = details

  const {stories = [], posts = []} = details

  const nopostview = postsCount === 0 ? 'nopostviewcss' : ''
  const postview = postsCount > 0 ? 'nopostviewcss' : ''

  return (
    <div className="profile-bgcontainer">
      <div className="profile-container">
        <div className="bio-container">
          <div className="profile-pic-container">
            <img src={profilePic} className="profile_pic" alt="my profile" />
          </div>
          <div>
            <h1 className="username">{userName}</h1>
            <div className="bio-details">
              <p>
                <span className="count">{postsCount}</span> posts
              </p>
              <p>
                <span className="count">{followersCount}</span> followers
              </p>
              <p>
                <span className="count">{followingCount}</span> following
              </p>
            </div>
            <p className="user-id">{userId}</p>
            <p className="bio">{userBio}</p>
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
