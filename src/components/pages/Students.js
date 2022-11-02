import React from 'react'
import MyStudentTable from '../table/MyStudentTable'
import './page.scss'

function Students() {
  return (
    <div className="mainBody">
      <h1>Students</h1>
      <MyStudentTable />
    </div>
  )
}
export default Students
