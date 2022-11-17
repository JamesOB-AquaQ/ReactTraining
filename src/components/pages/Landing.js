import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

function Landing() {
  const navigation = useNavigate()
  useEffect(() => {
    navigation('/students')
  })
  return (
    <div className="mainBody">
      <h1 className="pageHeading">Landing Page</h1>
      <p>
        Redirecting...
      </p>
    </div>
  )
}
export default Landing
