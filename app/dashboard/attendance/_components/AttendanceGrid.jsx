"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, provideGlobalGridOptions } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";

// Set up AG Grid license and module registration
LicenseManager.setLicenseKey("your License Key");
ModuleRegistry.registerModules([AllEnterpriseModule]);
provideGlobalGridOptions({ theme: "legacy" });

const AttendanceGrid = ({ attendanceList, selectmonth }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  useEffect(() => {
    const userList = uniqueRecord();

    const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
    const year = moment(selectmonth, "YYYY-MM").year();
    const month = moment(selectmonth, "YYYY-MM").month() + 1;
    const numberOfDays = daysInMonth(month, year);
    const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

    // Update row data with attendance fields
    const updatedRowData = userList.map((record) => {
      daysArray.forEach((day) => {
        record[day] = ispresent(record.student_id, day); // Set attendance value
      });
      return record;
    });

    setRowData(updatedRowData);

    // Define column definitions
    const staticCols = [
      { headerName: "ID", field: "student_id" },
      { headerName: "Student Name", field: "name" },
    ];

    const dynamicDayCols = daysArray.map((day) => ({
      headerName: `${day}`,
      field: `${day}`,
      editable: true,
      width: 100,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
     
        onCheckboxChange: (params) => {
          console.log("hjfhf",params);
          handleCheckboxChange(params, day);
        },
      },
    }));

    setColDefs([...staticCols, ...dynamicDayCols]);
  }, [attendanceList, selectmonth]);

  const ispresent = (student_id, day) => {
    const result = attendanceList.find(
      (record) => record.student_id === student_id && record.day === day
    );
    return result ? true : false;
  };

  const uniqueRecord = () => {
    const uniqueIds = new Set();
    const uniqueRecords = [];
    for (const record of attendanceList) {
      if (!uniqueIds.has(record.student_id)) {
        uniqueIds.add(record.student_id);
        uniqueRecords.push(record);
      }
    }
    return uniqueRecords;
  };

  const handleCheckboxChange = (params, day) => {
    const updatedData = [...rowData];
    const rowIndex = updatedData.findIndex(
      (row) => row.student_id === params.data.student_id
    );

    if (rowIndex !== -1) {
      updatedData[rowIndex][day] = !params.data[day]; // Toggle attendance
      setRowData(updatedData);

      console.log(
        `Attendance ${
          updatedData[rowIndex][day] ? "marked" : "unmarked"
        } for Student ID: ${params.data.student_id} on Day: ${day}`
      );
    }
  };

  const CheckboxCellRenderer = (props) => {
    return (
      <input
        type="checkbox"
        checked={props.value || false}
        onChange={() => props.onCheckboxChange(props)}
      />
    );
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default AttendanceGrid;
