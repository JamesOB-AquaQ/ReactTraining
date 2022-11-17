/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import './table.scss'
import './buttons.scss'
import {
  Trash2, Edit, PlusSquare, PlusCircle, MinusCircle, X
} from 'react-feather'
import { v4 as uuid } from 'uuid'

function MyTable() {
  const headerCols = [
    'Course ID',
    'Course Name',
    'Subject Area',
    'Semester',
    'Credit Amount',
    'Student Capacity',
    'Action'
  ]
  const [mainData, setMainData] = useState([])
  const baseUrl = 'http://localhost:8080/api/courses'
  const [myUrl, setMyUrl] = useState('http://localhost:8080/api/courses')
  const [selectFilter, setSelectFilter] = useState('courseId')
  const [filterValue, setFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)
  const [editingRow, setEditingRow] = useState()
  const [isDataRefreshNeeded, setIsDataRefreshNeeded] = useState(false)
  const [newCourseName, setNewCourseName] = useState('')
  const [newSubjectArea, setNewSubjectArea] = useState('')
  const [newSemester, setNewSemester] = useState('')
  const [newCreditAmount, setNewCreditAmount] = useState('')
  const [newStudentCapacity, setNewStudentCapacity] = useState('')
  const [isAddCourseFormVisible, setIsAddCourseFormVisible] = useState(false)
  const [postFailed, setPostFailed] = useState(false)

  const [filterMessage, setFilterMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [isActionMessageVisible, setIsActionMessageVisible] = React.useState(false)
  const [isFilterMessageVisible, setIsFilterMessageVisible] = React.useState(false)
  const [isError, setIsError] = useState(false)
  const [actionMessageTimeoutHandle, setActionMessageTimeoutHandle] = useState(0)
  const [filterMessageTimeoutHandle, setFilterMessageTimeoutHandle] = useState(0)

  const filterMessageTimeout = () => {
    setFilterMessageTimeoutHandle(setTimeout(() => {
      setIsFilterMessageVisible(false)
      setFilterMessage('')
    }, 3000))
  }
  const actionMessageTimeout = () => {
    setActionMessageTimeoutHandle(setTimeout(() => {
      setIsActionMessageVisible(false)
      setActionMessage('')
    }, 3000))
  }
  const showMessage = (message, type) => {
    if (type === 'filtermessage') {
      clearTimeout(filterMessageTimeoutHandle)
      setFilterMessage(message)
      setIsFilterMessageVisible(true)
      filterMessageTimeout()
    } else if (type === 'actionerror') {
      setIsError(true)
      clearTimeout(actionMessageTimeoutHandle)
      setActionMessage(message)
      setIsActionMessageVisible(true)
      actionMessageTimeout()
    } else if (type === 'actionsuccess') {
      setIsError(false)
      clearTimeout(actionMessageTimeoutHandle)
      setActionMessage(message)
      setIsActionMessageVisible(true)
      actionMessageTimeout()
    }
  }

  function resetInputRowValues() {
    setNewCourseName('')
    setNewSubjectArea('')
    setNewSemester('')
    setNewCreditAmount('')
    setNewStudentCapacity('')
    setPostFailed(false)
  }

  function toggleAddCourseForm() {
    setIsAddCourseFormVisible(!isAddCourseFormVisible)
    resetInputRowValues()
  }

  const resetTableData = () => {
    setMyUrl(baseUrl)
    setIsDataRefreshNeeded(true)
    setFilterValue('')
    setIsAddCourseFormVisible(false)
    setPostFailed(false)
    resetInputRowValues()
  }

  useEffect(() => {
    fetch(myUrl)
      .then((response) => response.json())
      .then((data) => {
        if (typeof (data.status) === 'undefined') {
          setMainData(data)
          if (data.length === 0) {
            showMessage('No data found', 'filtermessage')
          }
        } else if (isFilterAdded) {
          showMessage(data.message, 'filtermessage')
          setMyUrl(baseUrl)
          setFilterValue('')
          setIsFilterAdded(false)
        } else if (data.status === 404) {
          setMainData([])
        }
        setIsDataRefreshNeeded(false)
      })
  }, [myUrl, isFilterAdded, isDataRefreshNeeded])

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => row.courseId === rowData.courseId)[0]
    const prevValue = String(rowData[field])
    rowToUpdate[field] = value
    const course = rowData
    course[field] = value
    if (rowData[field] !== prevValue) {
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
            showMessage(`Course with ID: ${rowData.courseId} updated successfully`, 'actionsuccess')
          } else {
            rowToUpdate[field] = prevValue
            setEditingRow([])
            showMessage('Error updating course, please try again', 'actionerror')
          }
        })
    }
    setIsDataRefreshNeeded(true)
  }
  const removeRow = (rowData) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setMainData(mainData.filter((row) => (row.courseId !== rowData)))

      fetch(`${baseUrl}/${rowData}`, { method: 'DELETE' })
        .then((response) => {
          if (response.status === 200) {
            showMessage(`Course with ID: ${rowData} deleted`, 'actionsuccess')
          } else {
            showMessage('Error deleting course', 'actionerror')
          }
        })
    }
  }
  const applySearchFilter = () => {
    if (filterValue === '') {
      resetTableData()
      showMessage('Please enter a value to filter', 'filtermessage')
    } else
    if (selectFilter === 'courseId') {
      setMyUrl(`${baseUrl}/${filterValue}`)
      setIsFilterAdded(true)
    } else {
      setMyUrl(`${baseUrl}?${selectFilter}=${filterValue}`)
      setIsFilterAdded(true)
    }
  }
  const handleEditRow = (dataId) => {
    if (dataId === editingRow) {
      setEditingRow()
    } else {
      setEditingRow(dataId)
    }
  }

  const handlePostCourse = (event) => {
    event.preventDefault()
    if (window.confirm('Are you sure you want to add this course?')) {
      const newCourse = {
        courseName: `${newCourseName}`,
        subjectArea: `${newSubjectArea}`,
        semester: `${newSemester}`,
        creditAmount: `${newCreditAmount}`,
        studentCapacity: `${newStudentCapacity}`
      }
      fetch(baseUrl, { method: 'POST', body: JSON.stringify(newCourse), headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.status === 200) {
            showMessage(`Course: ${newCourseName} added`, 'actionsuccess')
            resetInputRowValues()
            setIsDataRefreshNeeded(true)
          } else {
            showMessage('Error adding course: Please check the data', 'actionerror')
            setPostFailed(true)
          }
        })
    }
  }

  const filter = (
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
        <button className="filterbutton" type="button" onClick={applySearchFilter}>
          Filter
        </button>

      </label>
      {isFilterMessageVisible
  && (
  <div className="filtermessage">
    <text>
      {filterMessage}
    </text>
  </div>
  )}
      {!isAddCourseFormVisible ? (
        <button className="buttonaddnew" style={{ marginLeft: 'auto' }} type="button" onClick={() => { toggleAddCourseForm() }}>
          New Course&nbsp;
          <PlusCircle size="1.7vw" />
        </button>
      ) : (
        <button className="buttonaddnew" style={{ marginLeft: 'auto' }} type="button" onClick={() => { toggleAddCourseForm() }}>
          New Course&nbsp;
          <MinusCircle size="1.7vw" />
        </button>
      )}
    </div>
  )

  return (
    <div>
      {filter}
      <table className="myTable">
        <thead>
          <tr>
            {headerCols.map((col) => (
              <th key={uuid()}>

                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mainData.length > 0 ? mainData.map((data) => (
            <tr key={uuid()}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  key={uuid()}
                  style={{
                    border: (data.courseId === editingRow) && (prop !== 'courseId') ? '2px solid blue' : '1px solid black'
                  }}
                  contentEditable={(data.courseId === editingRow) && (prop !== 'courseId')}
                  suppressContentEditableWarning="true"
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
                <button className="buttonedit-courses" type="button" onClick={() => { handleEditRow(data.courseId) }}>
                  <Edit className="icon-sizing" />
                </button>
                <button className="buttondelete-courses" type="button" onClick={() => { removeRow(data.courseId) }}>
                  <Trash2 className="icon-sizing" />
                </button>
              </td>
            </tr>
          )) : <tr><td>No course data found</td></tr>}
          {isAddCourseFormVisible && (
          <tr style={postFailed ? { backgroundColor: 'lightcoral' } : { backgroundColor: 'skyblue' }}>
            <td>New</td>
            <td>
              <div>
                <input
                  size="1"
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
                  size="1"
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
                  size="1"
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
                  size="1"
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
                  size="1"
                  type="text"
                  name="studentCapacity"
                  onChange={(e) => setNewStudentCapacity(e.currentTarget.value)}
                  onClick={() => setPostFailed(false)}
                  value={newStudentCapacity}
                />
              </div>
            </td>
            <td className="tdinvisible">
              <button className="buttonadd-courses" type="button" onClick={(e) => { handlePostCourse(e) }}>
                <PlusSquare className="icon-sizing" />
              </button>
              <button className="buttondelete-courses" type="button" onClick={() => { resetInputRowValues() }}>
                <X className="icon-sizing" />
              </button>
            </td>
          </tr>
          )}
        </tbody>

      </table>
      <button className="resetbutton" type="button" onClick={resetTableData}>
        Reset Table
      </button>
      {isActionMessageVisible
        && (
          <text className="actionmessage" style={{ fontWeight: 'bold', color: isError ? 'red' : 'royalblue' }}>
            {actionMessage}
          </text>
        )}
    </div>
  )
}

export default MyTable
