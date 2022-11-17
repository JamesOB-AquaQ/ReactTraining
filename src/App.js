/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Students from './components/pages/Students'
import Courses from './components/pages/Courses'
import NoPage from './components/pages/NoPage'
import SingleStudentEnrolment from './components/pages/SingleStudentEnrolment'
import Landing from './components/pages/Landing'
import './utils/app.scss'

function App() {
  return (
    <div>
      <div className="header">
        {' '}
        <h1>
          Student Enrolment Service
        </h1>
        <img className="logo" src="logo.png" alt="logo on the nav bar" />

      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="students" element={<Students />} />
            <Route path="enrolment" element={<SingleStudentEnrolment />} />
            <Route path="courses" element={<Courses />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
