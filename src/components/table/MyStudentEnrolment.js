/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './table.scss'
import './buttons.scss'
import {
  PlusCircle, MinusCircle
} from 'react-feather'

function MyStudentEnrolment() {
  const headerCols = [
    'Student ID',
    'Forename',
    'Surname',
    'Enrolment Year',
    'Graduation Year'
  ]
  const courseHeaderCols = [
    'Course ID',
    'Course Name',
    'Subject Area',
    'Semester',
    'Credit Amount',
    'Student Capacity',
    'Action'
  ]
  const [mainData, setMainData] = useState([])

  const [enrollSelectFilter, setEnrollSelectFilter] = useState('courseId')
  const [filterValue, setFilterValue] = useState('')
  const [enrollFilterValue, setEnrollFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)
  const [isEnrollOptionsVisible, setIsEnrollOptionsVisible] = React.useState(false)
  const [enrollCourseData, setEnrollCourseData] = useState([])

  const [selectedStudentId, setSelectedStudentId] = useState(useParams().studentId)
  const baseUrl = `http://localhost:8080/api/students/${selectedStudentId}`
  const baseStudentCourseUrl = `http://localhost:8080/api/students/${selectedStudentId}/courses`
  const baseEnrollCourseUrl = 'http://localhost:8080/api/courses'
  const [myUrl, setMyUrl] = useState(baseUrl)
  const [studentCourseUrl, setStudentCourseUrl] = useState(baseStudentCourseUrl)
  const [enrollCourseUrl, setEnrollCourseUrl] = useState(baseEnrollCourseUrl)
  const [availableStudentsData, setAvailableStudentData] = useState([])
  const [availableStudentsUrl] = useState('http://localhost:8080/api/students')
  const [isDataRefreshNeeded, setIsDataRefreshNeeded] = useState(false)
  const [studentName, setStudentName] = useState('')

  const [studentCoursesMessage, setStudentCoursesMessage] = useState('')
  const [courseFilterMessage, setCourseFilterMessage] = useState('')
  const [enrollMessage, setEnrollMessage] = useState('')
  const [unenrollMessage, setUnenrollMessage] = useState('')
  const [studentCourseData, setStudentCourseData] = useState([])
  const [isError, setIsError] = useState(false)
  const [isEnrollMessageVisible, setIsEnrollMessageVisible] = React.useState(false)
  const [isUnenrollMessageVisible, setIsUnenrollMessageVisible] = React.useState(false)
  const [isStudentCourseMessageVisible, setIsStudentCourseMessageVisible] = React.useState(false)
  const [studentCourseMessageTimeoutHandle, setStudentCourseMessageTimeoutHandle] = useState(0)
  const [enrollMessageTimeoutHandle, setEnrollMessageTimeoutHandle] = useState(0)
  const [unenrollMessageTimeoutHandle, setUnenrollMessageTimeoutHandle] = useState(0)

  const enrollMessageTimeout = () => {
    setEnrollMessageTimeoutHandle(setTimeout(() => {
      setIsEnrollMessageVisible(false)
      setEnrollMessage('')
    }, 5000))
  }
  const studentCourseMessageTimeout = () => {
    setStudentCourseMessageTimeoutHandle(setTimeout(() => {
      setIsStudentCourseMessageVisible(false)
      setStudentCoursesMessage('')
    }, 5000))
  }
  const unenrollMessageTimeout = () => {
    setUnenrollMessageTimeoutHandle(setTimeout(() => {
      setIsUnenrollMessageVisible(false)
      setUnenrollMessage('')
    }, 5000))
  }
  const showMessage = (message, type) => {
    if (type === 'studentCourseMessage') {
      clearTimeout(studentCourseMessageTimeoutHandle)
      setStudentCoursesMessage(message)
      setIsStudentCourseMessageVisible(true)
      studentCourseMessageTimeout()
    } else if (type === 'enrollError') {
      setIsError(true)
      clearTimeout(enrollMessageTimeoutHandle)
      setEnrollMessage(message)
      setIsEnrollMessageVisible(true)
      enrollMessageTimeout()
    } else if (type === 'enrollSuccess') {
      setIsError(false)
      clearTimeout(enrollMessageTimeoutHandle)
      setEnrollMessage(message)
      setIsEnrollMessageVisible(true)
      enrollMessageTimeout()
    } else if (type === 'unenrollError') {
      setIsError(true)
      clearTimeout(unenrollMessageTimeoutHandle)
      setUnenrollMessage(message)
      setIsUnenrollMessageVisible(true)
      unenrollMessageTimeout()
    } else if (type === 'unenrollSuccess') {
      setIsError(false)
      clearTimeout(unenrollMessageTimeoutHandle)
      setUnenrollMessage(message)
      setIsUnenrollMessageVisible(true)
      unenrollMessageTimeout()
    }
  }
  const resetStudentCoursesTableData = () => {
    setStudentCourseUrl(baseStudentCourseUrl)
    setIsDataRefreshNeeded(true)
  }
  const resetEnrollCourseTableData = () => {
    setEnrollCourseUrl(baseEnrollCourseUrl)
    setIsDataRefreshNeeded(true)
  }

  useEffect(() => {
    fetch(myUrl)
      .then((response) => response.json())
      .then((data) => {
        if (typeof (data.status) === 'undefined') {
          setMainData(data)
          setStudentName(`${data[0].forename} ${data[0].surname}`)
        } else {
          setMainData('error')
        }
      })

    fetch(studentCourseUrl)
      .then((response) => response.json())
      .then((data) => {
        if (typeof (data.status) === 'undefined') {
          setStudentCourseData(data)
          setCourseFilterMessage('')
        } else {
          showMessage(data.message, 'studentCourseMessage')
          setStudentCourseUrl(baseStudentCourseUrl)
        }
      })

    fetch(enrollCourseUrl)
      .then((response) => response.json())
      .then((data) => {
        if (typeof (data.status) === 'undefined') {
          setEnrollCourseData(data)
        } else {
          setEnrollCourseUrl(baseEnrollCourseUrl)
          showMessage(data.message, 'enrollError')
        }
      })

    fetch(availableStudentsUrl)
      .then((response) => response.json())
      .then((data) => {
        if (typeof (data.status) === 'undefined') {
          setAvailableStudentData(data)
        } else {
          setAvailableStudentData('error')
        }
      })
    setIsFilterAdded(false)
    setIsDataRefreshNeeded(false)
  }, [myUrl, studentCourseUrl, enrollCourseUrl, availableStudentsUrl, isFilterAdded, selectedStudentId, isDataRefreshNeeded])

  const applySearchFilter = () => {
    if (filterValue === '') {
      showMessage('Please enter a value to filter', 'studentCourseMessage')
      resetStudentCoursesTableData()
    } else {
      setStudentCourseUrl(`${baseStudentCourseUrl}?semester=${filterValue}`)
      setIsFilterAdded(true)
    }
  }
  const applyEnrollSearchFilter = () => {
    if (enrollFilterValue === '') {
      showMessage('Please enter a value to filter', 'enrollError')
      resetEnrollCourseTableData()
    } else
    if (enrollSelectFilter === 'courseId') {
      setEnrollCourseUrl(`${baseEnrollCourseUrl}/${enrollFilterValue}`)
      setIsFilterAdded(true)
    } else {
      setEnrollCourseUrl(`${baseEnrollCourseUrl}?${enrollSelectFilter}=${enrollFilterValue}`)
      setIsFilterAdded(true)
    }
  }
  const changeSelectedStudent = (studentId) => {
    setSelectedStudentId(studentId)
    setMyUrl(`http://localhost:8080/api/students/${studentId}`)
    setStudentCourseUrl(`http://localhost:8080/api/students/${studentId}/courses`)
    setIsDataRefreshNeeded(true)
    setIsEnrollOptionsVisible(false)
  }
  const handleUnenroll = (courseId) => {
    fetch(`${baseUrl}/unenroll/${courseId}`, { method: 'DELETE' })
      .then((response) => {
        if (response.status === 200) {
          showMessage('Course unenrolled successfully', 'unenrollSuccess')
        } else {
          showMessage('Course unenroll failed', 'unenrollError')
        }
      })
    setStudentCourseData(studentCourseData.filter((row) => (row.courseId !== courseId)))
  }

  const handleEnroll = (courseId) => {
    fetch(`${baseUrl}/enroll/${courseId}`, { method: 'POST' })
      .then((response) => response.json()).then((data) => {
        if (typeof (data.status) === 'undefined') {
          showMessage('Course enrolled successfully', 'enrollSuccess')
          setIsDataRefreshNeeded(true)
        } else {
          showMessage(`Enrolment error: ${data.message}`, 'enrollError')
          setIsDataRefreshNeeded(true)
        }
      })
  }
  const selectStudentOptions = (
    <div className="filter">
      <h2>
        Student ID:
        <select className="idselect" value={selectedStudentId} onChange={(e) => changeSelectedStudent(e.currentTarget.value)}>
          {availableStudentsData.map((data) => (<option key={data.studentid} value={data.studentId}>{data.studentId}</option>))}
        </select>
        {' '}
        {studentName}
      </h2>

    </div>
  )
  const enrolledCoursesTable = (
    <>
      <h2>Enrolled Courses</h2>
      <div className="filter">
        <label className="search">
          Search by Semester:
          <input className="searchbar" type="text" name="filterValue" onChange={(e) => setFilterValue(e.currentTarget.value)} />
          <button className="filterbutton" type="button" onClick={applySearchFilter}>
            Filter
          </button>
        </label>
        {isStudentCourseMessageVisible
  && (
  <div className="filtermessage">
    <text>
      {studentCoursesMessage}
    </text>
  </div>
  )}
      </div>
      <table className="myTable">
        <thead>
          <tr>
            {' '}
            {courseHeaderCols.map((col) => (
              <th>
                {col}
              </th>
            ))}
          </tr>

        </thead>
        <tbody>
          {courseFilterMessage === '' ? studentCourseData.map((data) => (
            <tr key={data.courseId}>
              {Object.entries(data).map(([, value]) => (
                <td>
                  {value}
                </td>
              ))}
              <td className="tdinvisible">
                <button className="button-unenroll" type="button" onClick={() => { handleUnenroll(data.courseId) }}>
                  Unenroll&nbsp;&nbsp;
                  <MinusCircle size="1.7vw" />
                </button>
              </td>
            </tr>
          )) : <tr><td>{courseFilterMessage}</td></tr>}
        </tbody>

      </table>
    </>
  )
  const enrollOptions = (
    <>
      <h2 style={{ color: 'green' }}>All Available Courses:</h2>
      <div className="filter">
        <select className="dropdown" value={enrollSelectFilter} onChange={(e) => setEnrollSelectFilter(e.currentTarget.value)}>
          <option value="courseId">Course ID</option>
          <option value="courseName">Course Name</option>
          <option value="subject">Subject Area</option>
          <option value="semester">Semester</option>
        </select>
        <label className="search">
          Search:
          <input className="searchbar" type="text" name="filterValue" onChange={(e) => setEnrollFilterValue(e.currentTarget.value)} />
          <button className="filterbutton" type="button" onClick={applyEnrollSearchFilter}>
            Filter
          </button>

        </label>
        {isEnrollMessageVisible
        && (
          <text className="actionmessage" style={{ fontWeight: 'bold', color: isError ? 'red' : 'forestgreen' }}>
            {enrollMessage}
          </text>
        )}
      </div>
      <div>
        <table className="myTable">
          <thead>
            <tr>
              {' '}
              {courseHeaderCols.map((col) => (
                <th>
                  {col}
                </th>
              ))}
            </tr>

          </thead>
          <tbody>
            { enrollCourseData.map((data) => (
              <tr key={data.courseId}>
                {Object.entries(data).map(([, value]) => (
                  <td>
                    {value}
                  </td>
                ))}
                <td className="tdinvisible">
                  <button className="buttonenroll" type="button" onClick={() => { handleEnroll(data.courseId) }}>
                    Enroll
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </>
  )

  return (
    <div className="mainBody">
      {selectStudentOptions}
      <table className="myTable">
        <thead>
          <tr>
            {' '}
            {headerCols.map((col) => (
              <th>
                {col}
              </th>
            ))}
          </tr>

        </thead>
        <tbody>
          { mainData.map((data) => (
            <tr key={data.studentId}>
              {Object.entries(data).map(([, value]) => (
                <td>
                  {value}
                </td>
              ))}

            </tr>
          )) }
        </tbody>
      </table>
      <br />
      {enrolledCoursesTable}
      <div className="filter">
        {!isEnrollOptionsVisible ? (
          <button className="button-enrolloptions" type="button" onClick={() => { setIsEnrollOptionsVisible(true) }}>
            Enroll in New Course&nbsp;
            <PlusCircle />
          </button>
        ) : (
          <button className="button-enrolloptions" type="button" onClick={() => { setIsEnrollOptionsVisible(false) }}>
            Hide Enroll Options&nbsp;
            <MinusCircle />
          </button>
        )}
        {isUnenrollMessageVisible
        && (
          <text className="actionmessage" style={{ fontWeight: 'bold', color: isError ? 'red' : 'forestgreen' }}>
            {unenrollMessage}
          </text>
        )}
      </div>
      {isEnrollOptionsVisible ? enrollOptions : null}
    </div>
  )
}

export default MyStudentEnrolment
