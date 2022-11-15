/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react'
import './table.scss'

function MySingleCourse() {
  const headerCols = [
    'Course ID',
    'Course Name',
    'Subject Area',
    'Semester',
    'Credit Amount',
    'Student Capacity'
  ]
  const [mainData, setMainData] = useState([])
  const baseUrl = 'http://localhost:8080/api/courses'
  const [myUrl, setMyUrl] = useState('http://localhost:8080/api/courses')
  const [selectFilter, setSelectFilter] = useState('courseId')
  const [filterValue, setFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)

  useEffect(() => {
    if (mainData.length === 0 || isFilterAdded) {
      fetch(myUrl)
        .then((data) => {
          setMainData(data)
          setIsFilterAdded(false)
        })
    }
  })

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => row.courseId === rowData)
    rowToUpdate[0][field] = value
  }
  const removeRow = (rowData) => {
    setMainData(mainData.filter((row) => (row.courseId !== rowData)))
  }

  function applySearchFilter() {
    if (selectFilter === 'courseId') {
      setMyUrl(`${baseUrl}/${filterValue}`)
      setIsFilterAdded(true)
    } else {
      setMyUrl(`${baseUrl}?${selectFilter}=${filterValue}`)
      setIsFilterAdded(true)
    }
    fetch(myUrl)
      .then((response) => response.json())
      .then((data) => {
        setMainData(data)
      })
  }

  const [editingRow, setEditingRow] = useState()
  return (
    <div className="mainBody">
      <select value={selectFilter} onChange={(e) => setSelectFilter(e.currentTarget.value)}>
        <option value="courseId">Course ID</option>
        <option value="courseName">Course Name</option>
        <option value="subject">Subject Area</option>
        <option value="semester">Semester</option>
      </select>
      <label>
        Search:
        <input type="text" name="filterValue" onChange={(e) => setFilterValue(e.currentTarget.value)} />
        <button type="button" onClick={applySearchFilter}>
          Filter
        </button>
      </label>

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
          <tr key={mainData.courseId}>
            {Object.entries(mainData).map(([prop, value]) => (
              <>
                <td
                  contentEditable={mainData.courseId === editingRow}
                  field={prop}
                  onBlur={(event) => {
                    updateRow(event.target.innerHTML, mainData)
                  }}
                >
                  {value}
                </td>
                <td>
                  <button type="button" onClick={() => { removeRow(mainData.courseId) }}>
                    Delete Row
                  </button>
                  <button type="button" onClick={() => { setEditingRow(mainData.courseId) }}>
                    Edit Row
                  </button>
                </td>

              </>
            ))}
          </tr>
        </tbody>

      </table>
    </div>
  )
}

export default MySingleCourse
