import React from 'react'

const SearchContext = React.createContext({
  showHomePage: true,
  onClickSearch: () => {},
  onRefreshHomePage: () => {},
  username: '',
  password: '',
  onChangeName: () => {},
  onChangePassword: () => {},
})

export default SearchContext
