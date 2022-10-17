import { string } from 'prop-types'
import React from 'react'

export default function Header(props) {
  console.log('props: ', props)
  const { myHeader } = props
  return (
    <div className="p-0 m-0 float-right">
      <h1 className="brand-page-title">
        {myHeader}
      </h1>
      <div className="brand-page-name">
        Department A
      </div>
    </div>

  )
}
Header.propTypes = {
  myHeader: string.isRequired
}
Header.defaultProps = {
  myHeader: 'Default Header'
}
