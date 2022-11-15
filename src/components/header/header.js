import { string } from 'prop-types'
import React from 'react'
import './header.scss'

export default function Header(props) {
  const { myHeader } = props
  return (
    <div className="myHeader">
      <h1 className="brand-page-title">
        {myHeader}
      </h1>
    </div>

  )
}
Header.propTypes = {
  myHeader: string.isRequired
}
