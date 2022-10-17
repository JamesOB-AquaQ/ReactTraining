import React from 'react'
import Header from '../header/header'
import './main.scss'
import MyTable from '../table/myTable'

function Main() {
  return (
    <div>
      <Header myHeader="My Header Value" />
      <MyTable />
    </div>
  )
}
export default Main
