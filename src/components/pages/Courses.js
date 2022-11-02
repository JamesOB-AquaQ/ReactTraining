import React from 'react'
import MyCourseTable from '../table/MyCourseTable'
import './page.scss'

function Courses() {
  return (
    <div className="mainBody">
      <h1>Courses</h1>
      <MyCourseTable />
    </div>
  )
}
export default Courses
