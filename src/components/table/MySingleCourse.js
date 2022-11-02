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
  //  const mainData = [...]
  const [mainData, setMainData] = useState([])
  const baseUrl = 'http://localhost:8080/api/courses'
  const [myUrl, setMyUrl] = useState('http://localhost:8080/api/courses')
  const [selectFilter, setSelectFilter] = useState('courseId')
  const [filterValue, setFilterValue] = useState('')
  const [isFilterAdded, setIsFilterAdded] = useState(false)

  useEffect(() => {
    console.log('I am using effect hook')
    if (mainData.length === 0 || isFilterAdded) {
      fetch(myUrl)
        .then((data) => {
          console.log('datareceived:', data)

          setMainData(data)
          setIsFilterAdded(false)
        })
    }
  })

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => row.courseId === rowData)
    console.log('value', value)
    console.log('field', field)
    console.log('rowToUpdate', rowToUpdate[0])
    rowToUpdate[0][field] = value
  }
  const removeRow = (rowData) => {
    console.log('removeRow', rowData)
    console.log('filter: ', mainData.filter((row) => (row.courseId !== rowData)))
    setMainData(mainData.filter((row) => (row.courseId !== rowData)))
  }

  function applySearchFilter() {
    console.log('handlingfilter')
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
        console.log('datareceived:', data)

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
                  // eslint-disable-next-line react/no-unknown-property
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
