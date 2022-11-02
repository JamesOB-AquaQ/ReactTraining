import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Students from './components/pages/Students'
import Courses from './components/pages/Courses'
import NoPage from './components/pages/NoPage'
import SingleStudent from './components/pages/SingleStudentEnrolment'
import './utils/app.scss'

function App() {
  return (
    <div>
      <div className="header">
        {' '}
        <h1>Student Enrolment Service</h1>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="students" element={<Students />} />
            <Route path="enrolment/:studentId" element={<SingleStudent />} />
            <Route path="courses" element={<Courses />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
