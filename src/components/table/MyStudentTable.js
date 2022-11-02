import React, { useEffect, useState } from 'react'
import './table.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom'

function MyTable() {
  const headerCols = [
    'Student ID',
    'Forename',
    'Surname',
    'Enrolment Year',
    'Graduation Year'
  ]
  //  const mainData = [...]
  const [mainData, setMainData] = useState([])
  const baseUrl = 'http://localhost:8080/api/students'
  const [myUrl, setMyUrl] = useState(baseUrl)
  const [selectFilter, setSelectFilter] = useState('studentId')
  const [filterValue, setFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [isMessageVisible, setIsMessageVisible] = React.useState(false)
  const [newForename, setNewForename] = useState('')
  const [newSurname, setNewSurname] = useState('')
  const [newEnrolmentYear, setNewEnrolmentYear] = useState('')
  const [newGraduationYear, setNewGraduationYear] = useState('')
  const [isNewStudentAdded, setIsNewStudentAdded] = useState(false)
  const [editingRow, setEditingRow] = useState()
  const [isDataRefreshNeeded, setIsDataRefreshNeeded] = useState(false)
  // const [isStudentDeleted, setIsStudentDeleted] = useState(false)
  setTimeout(() => {
    setIsMessageVisible(false)
    console.log('disappear')
  }, 10000)
  const resetTableData = () => {
    setMyUrl(baseUrl)
    setIsDataRefreshNeeded(true)
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
          if (data.length === 0) {
            setInfoMessage('No data found')
          }
        } else {
          console.log('data.status', data.status)

          setMainData('error')
          setErrorMessage(data.message)
        }
        setIsFilterAdded(false)
        setIsNewStudentAdded(false)
        setFilterValue('')
        setIsDataRefreshNeeded(false)
      })
  }, [myUrl, isFilterAdded, isNewStudentAdded, isDataRefreshNeeded])

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.studentId === rowData.studentId))[0]
    console.log('value', value)
    console.log('field', field)
    console.log('rowToUpdate', rowToUpdate)

    const prevValue = rowData[field]
    rowToUpdate[field] = value
    const student = rowData
    student[field] = value
    console.log('student', student)

    console.log('prevVlaue', prevValue)
    console.log('value', rowToUpdate[field])
    if (rowData[field] !== prevValue) {
      console.log('rowToUpdate', rowToUpdate)
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
            setInfoMessage('Student updated')
            setIsMessageVisible(true)
          } else {
            console.log('response', response)
            rowToUpdate[field] = prevValue
            setEditingRow([])
            setInfoMessage('Error updating student')
            setIsMessageVisible(true)
          }
        })
    }
    setIsDataRefreshNeeded(true)
  }

  const removeRow = (rowData) => {
    console.log('removeRow', rowData)
    console.log('filter: ', mainData.filter((row) => (row.studentId !== rowData)))
    setMainData(mainData.filter((row) => (row.studentId !== rowData)))

    fetch(`${baseUrl}/${rowData}`, { method: 'DELETE' })
      .then((response) => {
        console.log('delete data received: ', response)
        if (response.status === 200) {
          setInfoMessage(`Studentwith ID: ${rowData} deleted`)
          setIsMessageVisible(true)
        } else {
          setInfoMessage('Error deleting student')
          setIsMessageVisible(true)
        }
      })
  }
  const handlePostStudent = (event) => {
    event.preventDefault()
    const newStudent = {
      forename: `${newForename}`,
      surname: `${newSurname}`,
      enrolmentYear: `${newEnrolmentYear}`,
      graduationYear: `${newGraduationYear}`
    }
    console.log('newStudent', newStudent)
    console.log('newStudent', JSON.stringify(newStudent))
    fetch(baseUrl, { method: 'POST', body: JSON.stringify(newStudent), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        console.log('data received: ', response)
        if (response.status === 200) {
          setInfoMessage(`Student: ${newForename} ${newSurname} added`)
          setIsMessageVisible(true)
          setIsNewStudentAdded(true)
        } else {
          setInfoMessage('Error adding student: Please check the data')
          setIsMessageVisible(true)
        }
        setNewForename('')
        setNewSurname('')
        setNewGraduationYear('')
        setNewEnrolmentYear('')
      })
    // .then(() => setMainData(() => [...mainData, newStudent]))
    console.log('list', mainData)
  }

  const applySearchFilter = () => {
    console.log('handlingfilter')
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
    }
  }
  const filter = (
    <div>
      <select value={selectFilter} onChange={(e) => setSelectFilter(e.currentTarget.value)}>
        <option value="studentId">Student ID</option>
        <option value="name">Student Name</option>
        <option value="semester">Semester</option>
      </select>
      <label>
        Search:
        <input type="text" name="filterValue" value={filterValue} onChange={(e) => setFilterValue(e.currentTarget.value)} />
        <button type="button" onClick={applySearchFilter}>
          Filter
        </button>
      </label>
    </div>
  )
  return (
    <div>
      {filter}
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
          {errorMessage === '' ? mainData.map((data) => (
            <tr key={data.studentId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  contentEditable={data.studentId === editingRow}
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
                <button className="buttonedit" type="button" onClick={() => { setEditingRow(data.studentId) }}>
                  Edit Row
                </button>
                <button className="buttondelete" type="button" onClick={() => { removeRow(data.studentId) }}>
                  Delete Row
                </button>
              </td>
              <td className="tdinvisible">
                <Link to={`/enrolment/${data.studentId}`}>
                  <button className="buttonenroll" type="button">
                    View Enrolled Courses
                  </button>
                </Link>
              </td>
            </tr>
          )) : <tr><td className="error">{errorMessage}</td></tr>}
          <tr>
            <td>New</td>
            <td>
              <input type="text" name="forename" onChange={(e) => setNewForename(e.currentTarget.value)} value={newForename} />
            </td>
            <td>
              <input type="text" name="surname" onChange={(e) => setNewSurname(e.currentTarget.value)} value={newSurname} />
            </td>
            <td>
              <input type="text" name="enrolmentyear" onChange={(e) => setNewEnrolmentYear(e.currentTarget.value)} value={newEnrolmentYear} />
            </td>
            <td>
              <input type="text" name="graduationYear" onChange={(e) => setNewGraduationYear(e.currentTarget.value)} value={newGraduationYear} />
            </td>
            <td className="tdinvisible">
              <button className="buttonadd" type="button" onClick={(e) => { handlePostStudent(e) }}>
                Add Student
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
          <h3 className="error">
            {' '}
            {infoMessage}
            {' '}
          </h3>
        )}
    </div>
  )
}

export default MyTable
