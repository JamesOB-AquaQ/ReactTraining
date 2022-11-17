/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import './table.scss'
import './buttons.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom'
import {
  Trash2, Edit, PlusSquare, PlusCircle, Maximize2, MinusCircle, X
} from 'react-feather'
import { v4 as uuid } from 'uuid'

function MyTable() {
  const headerCols = [
    'Student ID',
    'Forename',
    'Surname',
    'Enrolment Year',
    'Graduation Year',
    'Actions'
  ]
  const [mainData, setMainData] = useState([])
  const baseUrl = 'http://localhost:8080/api/students'
  const [myUrl, setMyUrl] = useState(baseUrl)
  const [selectFilter, setSelectFilter] = useState('studentId')
  const [filterValue, setFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)
  const [newForename, setNewForename] = useState('')
  const [newSurname, setNewSurname] = useState('')
  const [newEnrolmentYear, setNewEnrolmentYear] = useState('')
  const [newGraduationYear, setNewGraduationYear] = useState('')
  const [editingRow, setEditingRow] = useState()
  const [isDataRefreshNeeded, setIsDataRefreshNeeded] = useState(false)
  const [isAddStudentFormVisible, setIsAddStudentFormVisible] = useState(false)
  const [postFailed, setPostFailed] = useState(false)

  const [filterMessage, setFilterMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [isFilterMessageVisible, setIsFilterMessageVisible] = React.useState(false)
  const [isActionMessageVisible, setIsActionMessageVisible] = React.useState(false)
  const [filterMessageTimeoutHandle, setFilterMessageTimeoutHandle] = useState(0)
  const [actionMessageTimeoutHandle, setActionMessageTimeoutHandle] = useState(0)

  const [isError, setIsError] = useState(false)
  function resetInputRowValues() {
    setNewForename('')
    setNewSurname('')
    setNewGraduationYear('')
    setNewEnrolmentYear('')
    setPostFailed(false)
  }
  function toggleAddStudentForm() {
    setIsAddStudentFormVisible(!isAddStudentFormVisible)
    resetInputRowValues()
  }
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
  const displayActionMessage = (
    <text className="actionmessage" style={{ fontWeight: 'bold', color: isError ? 'red' : 'royalblue' }}>
      {actionMessage}
    </text>
  )
  const displayFilterMessage = (
    <div className="filtermessage">
      <text>
        {filterMessage}
      </text>
    </div>
  )
  const resetTableData = () => {
    setMyUrl(baseUrl)
    setIsDataRefreshNeeded(true)
    setIsAddStudentFormVisible(false)
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
          setIsFilterAdded(false)
          setFilterValue('')
        } else if (data.status === 404) {
          setMainData([])
        }
        setIsDataRefreshNeeded(false)
      })
  }, [myUrl, isFilterAdded, isDataRefreshNeeded])

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.studentId === rowData.studentId))[0]
    const prevValue = rowData[field]
    rowToUpdate[field] = value
    const student = rowData
    student[field] = value
    if (rowData[field] !== prevValue) {
      fetch(`${baseUrl}/${rowToUpdate.studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
      })
        .then((response) => {
          if (response.ok) {
            rowToUpdate[field] = value
            showMessage(`Student with ID: ${rowData.studentId} updated successfully`, 'actionsuccess')
          } else {
            rowToUpdate[field] = prevValue
            setEditingRow([])
            showMessage('Error updating student, please try again', 'actionerror')
          }
        })
    }
    setIsDataRefreshNeeded(true)
  }

  const removeRow = (rowData) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setMainData(mainData.filter((row) => (row.studentId !== rowData)))

      fetch(`${baseUrl}/${rowData}`, { method: 'DELETE' })
        .then((response) => {
          if (response.status === 200) {
            showMessage(`Student with ID: ${rowData} deleted`, 'actionsuccess')
          } else {
            showMessage('Error deleting student', 'actionerror')
          }
        })
    }
  }

  const handlePostStudent = (event) => {
    event.preventDefault()
    if (window.confirm('Are you sure you want to add this student?')) {
      const newStudent = {
        forename: `${newForename}`,
        surname: `${newSurname}`,
        enrolmentYear: `${newEnrolmentYear}`,
        graduationYear: `${newGraduationYear}`
      }
      fetch(baseUrl, { method: 'POST', body: JSON.stringify(newStudent), headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.status === 200) {
            showMessage(`Student: ${newForename} ${newSurname} added`, 'actionsuccess')
            resetInputRowValues()
            setIsDataRefreshNeeded(true)
          } else {
            showMessage('Error adding student: Please check the data', 'actionerror')
            setPostFailed(true)
          }
        })
    }
  }

  const applySearchFilter = () => {
    if (filterValue !== '') {
      if (selectFilter === 'studentId') {
        setMyUrl(`${baseUrl}/${filterValue}`)
        setIsFilterAdded(true)
      } else if (selectFilter === 'name') {
        const [first, last] = filterValue.split(' ')
        setMyUrl(`${baseUrl}?forename=${first}&surname=${last}`)
        setIsFilterAdded(true)
      } else {
        setMyUrl(`${baseUrl}?${selectFilter}=${filterValue}`)
        setIsFilterAdded(true)
      }
    } else {
      resetTableData()
      showMessage('Please enter a value to filter', 'filtermessage')
    }
  }
  const handleEditRow = (dataId) => {
    if (dataId === editingRow) {
      setEditingRow()
    } else {
      setEditingRow(dataId)
    }
  }
  const filter = (
    <div className="filter">
      <select className="dropdown" value={selectFilter} onChange={(e) => setSelectFilter(e.currentTarget.value)}>
        <option value="studentId">Student ID</option>
        <option value="name">Student Name</option>
        <option value="semester">Semester</option>
      </select>

      <label className="search">
        Filter Value:
        <input className="searchbar" type="text" name="filterValue" value={filterValue} onChange={(e) => setFilterValue(e.currentTarget.value)} />
        <button className="filterbutton" type="button" onClick={applySearchFilter}>
          Filter
        </button>

      </label>
      {isFilterMessageVisible
  && displayFilterMessage}

      {!isAddStudentFormVisible ? (
        <button className="buttonaddnew" style={{ marginLeft: 'auto' }} type="button" onClick={() => { toggleAddStudentForm() }}>
          New Student&nbsp;
          <PlusCircle size="1.7vw" />
        </button>
      ) : (
        <button className="buttonaddnew" style={{ marginLeft: 'auto' }} type="button" onClick={() => { toggleAddStudentForm() }}>
          New Student&nbsp;
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
                    border: (data.studentId === editingRow) && (prop !== 'studentId') ? '2px solid blue' : '1px solid black'
                  }}
                  contentEditable={(data.studentId === editingRow) && (prop !== 'studentId')}
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
                <button className="buttonedit-students" type="button" onClick={() => { handleEditRow(data.studentId) }}>
                  <Edit className="icon-sizing" />
                </button>
                <button className="buttondelete-students" type="button" onClick={() => { removeRow(data.studentId) }}>
                  <Trash2 className="icon-sizing" />
                </button>
                <Link to={`/enrolment?studentId=${data.studentId}`}>
                  <button className="buttonviewenroll-students" type="button">
                    <Maximize2 className="icon-sizing" />
                  </button>
                </Link>
              </td>
            </tr>
          )) : <tr><td>No student data found</td></tr>}
          {isAddStudentFormVisible && (
          <tr style={postFailed ? { backgroundColor: 'lightcoral' } : { backgroundColor: 'skyblue' }}>
            <td>New</td>
            <td>
              <div>
                <input
                  size="1"
                  type="text"
                  name="forename"
                  onChange={(e) => setNewForename(e.currentTarget.value)}
                  value={newForename}
                  onClick={() => setPostFailed(false)}
                />
              </div>
            </td>
            <td>
              <div>
                <input
                  size="1"
                  type="text"
                  name="surname"
                  onChange={(e) => setNewSurname(e.currentTarget.value)}
                  value={newSurname}
                  onClick={() => setPostFailed(false)}
                />
              </div>
            </td>
            <td>
              <div>
                <input
                  size="1"
                  type="text"
                  name="enrolmentyear"
                  onChange={(e) => setNewEnrolmentYear(e.currentTarget.value)}
                  value={newEnrolmentYear}
                  onClick={() => setPostFailed(false)}
                />
              </div>
            </td>
            <td>
              <div>
                <input
                  size="1"
                  type="text"
                  name="graduationYear"
                  onChange={(e) => setNewGraduationYear(e.currentTarget.value)}
                  value={newGraduationYear}
                  onClick={() => setPostFailed(false)}
                />
              </div>
            </td>
            <td className="tdinvisible">
              <button className="buttonadd-students" type="button" onClick={(e) => { handlePostStudent(e) }}>
                <PlusSquare className="icon-sizing" />
              </button>
              <button className="buttondelete-students" type="button" onClick={() => { resetInputRowValues() }}>
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
        && displayActionMessage}
    </div>
  )
}

export default MyTable
