import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './table.scss'

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
    'Student Capacity'
  ]
  //  const mainData = [...]
  const [mainData, setMainData] = useState([])

  const [enrollSelectFilter, setEnrollSelectFilter] = useState('courseId')
  const [filterValue, setFilterValue] = useState('')
  const [enrollFilterValue, setEnrollFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)
  const [studentErrorMessage, setStudentErrorMessage] = useState('')
  const [courseErrorMessage, setCourseErrorMessage] = useState('')
  const [enrollErrorMessage, setEnrollErrorMessage] = useState('')
  const [courseData, setCourseData] = useState([])
  const [infoMessage, setInfoMessage] = useState('')
  const [isMessageVisible, setIsMessageVisible] = React.useState(false)
  const [isEnrollOptionsVisible, setIsEnrollOptionsVisible] = React.useState(false)
  const [enrollCourseData, setEnrollCourseData] = useState([])

  const [selectedStudentId, setSelectedStudentId] = useState(useParams().studentId)
  const baseUrl = `http://localhost:8080/api/students/${selectedStudentId}`
  const baseCourseUrl = `http://localhost:8080/api/students/${selectedStudentId}/courses`
  const baseEnrollCourseUrl = 'http://localhost:8080/api/courses'
  const [myUrl, setMyUrl] = useState(baseUrl)
  const [courseUrl, setCourseUrl] = useState(baseCourseUrl)
  const [enrollCourseUrl, setEnrollCourseUrl] = useState(baseEnrollCourseUrl)
  const [availableStudentsData, setAvailableStudentData] = useState([])
  const [availableStudentsUrl, setAvailableStudentsUrl] = useState('http://localhost:8080/api/students')
  const [isDataRefreshNeeded, setIsDataRefreshNeeded] = useState(false)
  const [studentName, setStudentName] = useState('')
  const resetStudentCoursesTableData = () => {
    setCourseUrl(baseCourseUrl)
    setIsDataRefreshNeeded(true)
  }
  const resetEnrollCourseTableData = () => {
    setEnrollCourseUrl(baseEnrollCourseUrl)
    setIsDataRefreshNeeded(true)
  }
  setTimeout(() => {
    setIsMessageVisible(false)
    console.log('disappear')
  }, 10000)
  const displayTempMessage = (message) => {
    console.log('displayTempMessage')
    setInfoMessage(message)
    setIsMessageVisible(true)
    setTimeout(() => { setIsMessageVisible(false) }, 10000)
  }
  const displayTempEnrollMessage = (message) => {
    console.log('displayTempEnrollMessage')
    setEnrollErrorMessage(message)
    setIsMessageVisible(true)
    setTimeout(() => { setIsMessageVisible(false) }, 10000)
  }
  useEffect(() => {
    console.log('I am using effect hook')

    fetch(myUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('datareceived:', data)

        // setMainData(data)
        if (typeof (data.status) === 'undefined') {
          setMainData(data)
          setStudentErrorMessage('')
          setStudentName(`${data[0].forename} ${data[0].surname}`)
        } else {
          console.log('data.status', data.status)

          setMainData('error')
          setStudentErrorMessage(data.message)
        }
      })

    fetch(courseUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('coursedatareceived:', data)

        // setMainData(data)
        if (typeof (data.status) === 'undefined') {
          setCourseData(data)
          setCourseErrorMessage('')
        } else {
          console.log('data.status', data.status)

          setCourseData('error')
          setCourseErrorMessage(data.message)
        }
      })

    fetch(enrollCourseUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('datareceived:', data)

        // setMainData(data)
        if (typeof (data.status) === 'undefined') {
          setEnrollCourseData(data)
          displayTempEnrollMessage('')
        } else {
          console.log('data.status', data.status)

          setEnrollCourseData('error')
          displayTempEnrollMessage(data.message)
          console.log(enrollErrorMessage)
        }
      })

    fetch(availableStudentsUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('datareceived:', data)

        // setMainData(data)
        if (typeof (data.status) === 'undefined') {
          setAvailableStudentData(data)
          setStudentErrorMessage('')
        } else {
          console.log('data.status', data.status)

          setAvailableStudentData('error')
          setStudentErrorMessage(data.message)
        }
      })
    setIsFilterAdded(false)
    setIsDataRefreshNeeded(false)
  }, [myUrl, courseUrl, enrollCourseUrl, availableStudentsUrl, isFilterAdded, selectedStudentId, isDataRefreshNeeded, enrollErrorMessage])

  const applySearchFilter = () => {
    console.log('handlingfilter')
    if (filterValue === '') {
      resetStudentCoursesTableData()
    } else {
      setCourseUrl(`${baseCourseUrl}?semester=${filterValue}`)
      setIsFilterAdded(true)
    }
  }
  const applyEnrollSearchFilter = () => {
    console.log('handlingfilter')
    if (enrollFilterValue === '') {
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
    console.log('handlingfilter')
    setSelectedStudentId(studentId)
    setMyUrl(`http://localhost:8080/api/students/${studentId}`)
    setCourseUrl(`http://localhost:8080/api/students/${studentId}/courses`)
    setIsDataRefreshNeeded(true)
    setIsEnrollOptionsVisible(false)
  }
  const handleUnenroll = (courseId) => {
    console.log('unenroll', courseId)
    fetch(`${baseUrl}/unenroll/${courseId}`, { method: 'DELETE' })
      .then((response) => {
        console.log('delete data received: ', response)
        if (response.status === 200) {
          displayTempMessage('Student unenrolled')
        } else {
          displayTempMessage('Unenroll failed')
        }
      })
    setCourseData(courseData.filter((row) => (row.courseId !== courseId)))
  }

  const handleEnroll = (courseId) => {
    console.log('enroll', courseId)
    fetch(`${baseUrl}/enroll/${courseId}`, { method: 'POST' })
      .then((response) => response.json()).then((data) => {
        console.log('post data received: ', data)
        if (typeof (data.status) === 'undefined') {
          // setInfoMessage(`Student${rowData} deleted`)
          displayTempMessage('Student enrolled')
          // setIsMessageVisible(true)
          console.log('runEffect', isDataRefreshNeeded)
          setIsDataRefreshNeeded(true)
          console.log('runEffect', isDataRefreshNeeded)
          console.log('Senroll', courseId)
        } else {
          // setInfoMessage('enroll failed')
          displayTempMessage(`Enrolment error: ${data.message}`)
          setIsDataRefreshNeeded(true)
          console.log('Fenroll', courseId)
        }
      })
    // setCourseData(courseData.filter((row) => (row.courseId !== courseId)))
  }
  const selectStudentOptions = (
    <div>
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
      <label className="textlabel">
        Search by Semester:
        <input type="text" name="filterValue" onChange={(e) => setFilterValue(e.currentTarget.value)} />
        <button type="button" onClick={applySearchFilter}>
          Filter
        </button>
      </label>
      <table className="myTable">
        <thead>
          <tr>
            {' '}
            {courseHeaderCols.map((col) => (
              <td>
                {col}
              </td>
            ))}
          </tr>

        </thead>
        <tbody>
          {courseErrorMessage === '' ? courseData.map((data) => (
            <tr key={data.courseId}>
              {Object.entries(data).map(([, value]) => (
                <td>
                  {value}
                </td>
              ))}
              <td className="tdinvisible">
                <button className="buttondelete" type="button" onClick={() => { handleUnenroll(data.courseId) }}>
                  Unenroll
                </button>
              </td>
            </tr>
          )) : <tr><td>{courseErrorMessage}</td></tr>}
        </tbody>

      </table>
    </>
  )
  const enrollOptions = (
    <div className="enroll-options">
      <h1>All Available Courses</h1>
      <select value={enrollSelectFilter} onChange={(e) => setEnrollSelectFilter(e.currentTarget.value)}>
        <option value="courseId">Course ID</option>
        <option value="courseName">Course Name</option>
        <option value="subject">Subject Area</option>
        <option value="semester">Semester</option>
      </select>
      <label>
        Search:
        <input type="text" name="filterValue" onChange={(e) => setEnrollFilterValue(e.currentTarget.value)} />
        <button type="button" onClick={applyEnrollSearchFilter}>
          Filter
        </button>
          &ensp;
        {enrollErrorMessage}
      </label>
      <table className="myTable">
        <thead>
          <tr>
            {' '}
            {courseHeaderCols.map((col) => (
              <td>
                {col}
              </td>
            ))}
          </tr>

        </thead>
        <tbody>
          {enrollErrorMessage === '' ? enrollCourseData.map((data) => (
            <tr key={data.courseId}>
              {Object.entries(data).map(([, value]) => (
                <td>
                  {value}
                </td>
              ))}
              <td>
                <button type="button" onClick={() => { handleEnroll(data.courseId) }}>
                  Enroll
                </button>
              </td>
            </tr>
          )) : <tr><td>{enrollErrorMessage}</td></tr>}
        </tbody>

      </table>
      <button type="button" onClick={() => { setIsEnrollOptionsVisible(false) }}>Hide Enroll Options</button>
    </div>
  )

  return (
    <div className="mainBody">
      {selectStudentOptions}
      <table className="myTable">
        <thead>
          <tr>
            {' '}
            {headerCols.map((col) => (
              <td>
                {col}
              </td>
            ))}
          </tr>

        </thead>
        <tbody>
          {studentErrorMessage === '' ? mainData.map((data) => (
            <tr key={data.studentId}>
              {Object.entries(data).map(([, value]) => (
                <td>
                  {value}
                </td>
              ))}

            </tr>
          )) : <tr><td>{studentErrorMessage}</td></tr>}
        </tbody>
      </table>
      <br />
      {enrolledCoursesTable}

      <button className="buttonadd" style={{ width: '6vw', margin: '5px' }} type="button" onClick={() => { setIsEnrollOptionsVisible(true) }}>
        Enroll in New Course
      </button>
      {isEnrollOptionsVisible ? enrollOptions : null}
      {isMessageVisible
        && (
          <h3 className="infoMessage">
            {' '}
            {infoMessage}
            {' '}
          </h3>
        )}
    </div>
  )
}

export default MyStudentEnrolment
