import React, { useEffect, useState } from 'react'
import './table.scss'

function MyTable() {
  const headerCols = [
    'Course ID',
    'Course Name',
    'Subject Area',
    'Semester',
    'Credit Amount',
    'Student Capacity'
  ]
  //  const mainData = [...]
  const [mainData, setMainData] = useState([])
  const baseUrl = 'http://localhost:8080/api/courses'
  const [myUrl, setMyUrl] = useState('http://localhost:8080/api/courses')
  const [selectFilter, setSelectFilter] = useState('courseId')
  const [filterValue, setFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [validationError, setValidationError] = useState('')
  const [editingRow, setEditingRow] = useState()
  const [infoMessage, setInfoMessage] = useState('')
  const [isMessageVisible, setIsMessageVisible] = React.useState(false)
  const [isDataRefreshNeeded, setIsDataRefreshNeeded] = useState(false)
  const [newCourseName, setNewCourseName] = useState('')
  const [newSubjectArea, setNewSubjectArea] = useState('')
  const [newSemester, setNewSemester] = useState('')
  const [newCreditAmount, setNewCreditAmount] = useState('')
  const [newStudentCapacity, setNewStudentCapacity] = useState('')
  const [isNewCourseAdded, setIsNewCourseAdded] = useState(false)
  const [postFailed, setPostFailed] = useState(false)
  const [isError, setIsError] = useState(false)
  setTimeout(() => {
    setIsMessageVisible(false)
    setInfoMessage('')
    setValidationError('')
    console.log('disappear')
  }, 10000)
  const resetTableData = () => {
    setMyUrl(baseUrl)
    setIsDataRefreshNeeded(true)
    console.log('filterValue', filterValue)
    setFilterValue('')
    console.log('filterValue', filterValue)
  }
  useEffect(() => {
    console.log('I am using effect hook')

    fetch(myUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('datareceived:', data)

        if (typeof (data.status) === 'undefined') {
          setMainData(data)
          setErrorMessage('')
        } else {
          console.log('error', data.status)
          console.log('data.status', data.status)

          setValidationError(data.message)
          setIsMessageVisible(true)
          resetTableData()
        }
        setIsFilterAdded(false)
        setIsDataRefreshNeeded(false)
      })
  }, [myUrl, isFilterAdded, isDataRefreshNeeded])

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => row.courseId === rowData.courseId)[0]
    console.log('value', value)
    console.log('field', field)
    console.log('rowToUpdate', rowToUpdate[0])
    const prevValue = rowData[field]
    rowToUpdate[field] = value
    const course = rowData
    course[field] = value
    console.log('course', course)

    console.log('prevVlaue', prevValue)
    console.log('value', rowToUpdate[field])
    if (rowData[field] !== prevValue) {
      console.log('rowToUpdate', rowToUpdate)
      fetch(`${baseUrl}/${rowToUpdate.courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
      })
        .then((response) => {
          if (response.ok) {
            rowToUpdate[field] = value
            setInfoMessage('Course updated')
            setIsMessageVisible(true)
            console.log('responseS', response)
          } else {
            console.log('response', response)
            rowToUpdate[field] = prevValue
            setEditingRow([])
            setInfoMessage('Error updating course')
            setIsMessageVisible(true)
          }
        })
    }
    setIsDataRefreshNeeded(true)
  }
  const removeRow = (rowData) => {
    console.log('removeRow', rowData)
    console.log('filter: ', mainData.filter((row) => (row.courseId !== rowData)))
    setMainData(mainData.filter((row) => (row.courseId !== rowData)))

    fetch(`${baseUrl}/${rowData}`, { method: 'DELETE' })
      .then((response) => {
        console.log('delete data received: ', response)
        if (response.status === 200) {
          setInfoMessage(`Course with ID: ${rowData} deleted`)
          setIsMessageVisible(true)
        } else {
          setInfoMessage('Error deleting course')
          setIsMessageVisible(true)
        }
      })
  }
  const applySearchFilter = () => {
    console.log('handlingfilter')
    if (filterValue === '') {
      resetTableData()
      setValidationError('Please enter a value to filter by')
      setIsMessageVisible(true)
    } else
    if (selectFilter === 'courseId') {
      // if (!Number.isInteger(filterValue)) {
      //   setValidationError('ID provided not a valid integer')
      //   setMyUrl(baseUrl)
      // } else {
      setMyUrl(`${baseUrl}/${filterValue}`)
      setIsFilterAdded(true)
      // }
    } else {
      setMyUrl(`${baseUrl}?${selectFilter}=${filterValue}`)
      setIsFilterAdded(true)
    }
  }
  const handlePostCourse = (event) => {
    event.preventDefault()
    const newCourse = {
      courseName: `${newCourseName}`,
      subjectArea: `${newSubjectArea}`,
      semester: `${newSemester}`,
      creditAmount: `${newCreditAmount}`,
      studentCapacity: `${newStudentCapacity}`
    }
    console.log('newCourse', newCourse)
    console.log('newCourse', JSON.stringify(newCourse))
    fetch(baseUrl, { method: 'POST', body: JSON.stringify(newCourse), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        console.log('data received: ', response)
        if (response.status === 200) {
          setInfoMessage(`Course: ${newCourseName} added`)
          setIsMessageVisible(true)
          setIsNewCourseAdded(true)
          setIsDataRefreshNeeded(true)
          setIsError(false)
        } else {
          setInfoMessage('Error adding student: Please check the data')
          setIsMessageVisible(true)
          setPostFailed(true)
          setIsError(true)
          console.log('post failed', postFailed)
        }
        setNewCourseName('')
        setNewSubjectArea('')
        setNewSemester('')
        setNewCreditAmount('')
        setNewStudentCapacity('')
      })
    // .then(() => setMainData(() => [...mainData, newStudent]))
    console.log('list', mainData)
  }

  return (
    <div>
      <div className="filter">
        <select className="dropdown" value={selectFilter} onChange={(e) => setSelectFilter(e.currentTarget.value)}>
          <option value="courseId">Course ID</option>
          <option value="courseName">Course Name</option>
          <option value="subject">Subject Area</option>
          <option value="semester">Semester</option>
        </select>

        <label className="search">
          &ensp;
          Search Value:
          &nbsp;
          <input className="searchbar" type="text" name="filterValue" value={filterValue} onChange={(e) => setFilterValue(e.currentTarget.value)} />
          &nbsp;
          <button className="filterbutton" type="button" onClick={applySearchFilter}>
            Filter
          </button>
          {isMessageVisible
        && (
        <>
          &ensp;
          {validationError}
        </>

        )}
        </label>
      </div>
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
          {mainData.map((data) => (
            <tr key={data.courseId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  contentEditable={data.courseId === editingRow}
                  // eslint-disable-next-line react/no-unknown-property
                  field={prop}
                  onBlur={(event) => {
                    updateRow(event.target.innerHTML, data, prop)
                  }}
                >
                  {value}
                </td>
              ))}
              <td className="tdinvisible">
                <button className="buttonedit" type="button" onClick={() => { setEditingRow(data.courseId) }}>
                  Edit
                  <br />
                  Row
                </button>
                <button className="buttondelete" type="button" onClick={() => { removeRow(data.courseId) }}>
                  Delete
                  <br />
                  Row
                </button>
              </td>
            </tr>
          ))}
          <tr className={postFailed ? 'trerror' : 'tr-inputs'}>
            <td>New</td>
            <td>
              <div>
                <input
                // className="inputrow"
                  type="text"
                  name="courseName"
                  onChange={(e) => setNewCourseName(e.currentTarget.value)}
                  onClick={() => setPostFailed(false)}
                  value={newCourseName}
                />
              </div>
            </td>
            <td>
              <div>
                <input
                // className="inputrow"
                  type="text"
                  name="subjectArea"
                  onChange={(e) => setNewSubjectArea(e.currentTarget.value)}
                  onClick={() => setPostFailed(false)}
                  value={newSubjectArea}
                />
              </div>
            </td>
            <td>
              <div>
                <input
                // className="inputrow"
                  type="text"
                  name="semester"
                  onChange={(e) => setNewSemester(e.currentTarget.value)}
                  onClick={() => setPostFailed(false)}
                  value={newSemester}
                />
              </div>
            </td>
            <td>
              <div>
                <input
                // className="inputrow"
                // style={{ width: 150 }}
                  type="text"
                  name="creditAmount"
                  onChange={(e) => setNewCreditAmount(e.currentTarget.value)}
                  onClick={() => setPostFailed(false)}
                  value={newCreditAmount}
                />
              </div>
            </td>
            <td>
              <div>
                <input
                // className="inputrow"
                // style={{ width: 150 }}
                  type="text"
                  name="studentCapacity"
                  onChange={(e) => setNewStudentCapacity(e.currentTarget.value)}
                  onClick={() => setPostFailed(false)}
                  value={newStudentCapacity}
                />
              </div>
            </td>
            <td className="tdinvisible">
              <button className="buttonadd" type="button" onClick={(e) => { handlePostCourse(e) }}>
                Add Course
              </button>
            </td>
          </tr>
        </tbody>

      </table>
      <button type="button" onClick={resetTableData}>
        Reset Table
      </button>
      {isMessageVisible
        && (
          <h3 className={isError ? 'error' : 'infoMessage'}>
            {' '}
            {infoMessage}
            {' '}
          </h3>
        )}
    </div>
  )
}

export default MyTable
