import React from 'react'
import MyCourseTable from '../table/MyCourseTable'
import './page.scss'

function Courses() {
  return (
    <div className="mainBody">
      <h1 className="pageHeading">Course List</h1>
      <MyCourseTable />
    </div>
  )
}
export default Courses
