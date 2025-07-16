import {withRouter} from 'react-router-dom'
import './index.css'

const NotFound = props => {
  const onClickHomepage = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="notFound-container">
      <img
        src="https://res.cloudinary.com/dya0bwju7/image/upload/v1749728331/erroring_1_hkmi72.png"
        alt="page not found"
        className="not-found-img"
      />
      <h1 className="not-found-head">PAGE NOT FOUND</h1>
      <p className="not-found-para">
        we are sorry, the page you requested could not be found.
        <br />
        Please go back to the homepage.
      </p>
      <button
        type="button"
        className="homepage-button"
        onClick={onClickHomepage}
      >
        Home Page
      </button>
    </div>
  )
}

export default withRouter(NotFound)
