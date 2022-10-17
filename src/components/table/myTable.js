import React, { useEffect, useState } from 'react'
import './table.scss'

function MyTable() {
  const headerCols = [
    'ID',
    'First Name',
    'Second Name',
    'Active',
    'Salary',
    'Delete'
  ]
  //  const mainData = [...]
  const [mainData, setMainData] = useState([])
  const siteCode = '713a6c1a-a5da-42d6-ae57-58f513ab838d'
  const myUrl = `https://run.mocky.io/v3/${siteCode}`
  useEffect(() => {
    console.log('I am using effect hook')
    if (mainData.length === 0) {
      fetch(myUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('datareceived:', data)

          setMainData(data)
        })
    }
  })
  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => row.id === rowData.id)
    console.log('value', value)
    console.log('field', field)
    console.log('rowToUpdate', rowToUpdate[0])
    rowToUpdate[0][field] = value
  }
  const removeRow = (rowData) => {
    console.log('removeRow', rowData)
    console.log('filter: ', mainData.filter((row) => (row.id !== rowData.id)))
    setMainData(mainData.filter((row) => (row.id !== rowData.id)))
  }
  const [editingRow, setEditingRow] = useState()
  return (
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
          <tr key={data.id}>
            {Object.entries(data).map(([prop, value]) => (
              <td
                contentEditable={data.id === editingRow}
                field={prop}
                onBlur={(event) => {
                  updateRow(event.target.innerHTML, data)
                }}
              >
                {value}
              </td>
            ))}
            <td>
              <button type="button" onClick={() => { removeRow(data) }}>
                Delete Row
              </button>
              <button type="button" onClick={() => { setEditingRow(data.id) }}>
                Edit Row
              </button>
            </td>
          </tr>
        ))}
      </tbody>

    </table>
  )
}

export default MyTable
