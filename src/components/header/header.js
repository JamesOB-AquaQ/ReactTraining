import { string } from 'prop-types'
import React from 'react'
import './header.scss'

export default function Header(props) {
  console.log('props: ', props)
  const { myHeader } = props
  return (
    <div className="myHeader">
      <h1 className="brand-page-title">
        {myHeader}
      </h1>
      {/* <div className="brand-page-name">
        Department A
      </div> */}
    </div>

  )
}
Header.propTypes = {
  myHeader: string.isRequired
}
