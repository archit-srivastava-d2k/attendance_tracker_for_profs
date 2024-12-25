"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, provideGlobalGridOptions } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";
import GlobalApis from "@/app/_services/GlobalApis";
import { toast } from "sonner";
import SelectAllAttendance from "./SelectAll";

// Set up AG Grid license and module registration
LicenseManager.setLicenseKey("your License Key");
ModuleRegistry.registerModules([AllEnterpriseModule]);
provideGlobalGridOptions({ theme: "legacy" });

const AttendanceGrid = ({ attendanceList, selectmonth }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  useEffect(() => {
    const userList = getUniqueRecords();
    const year = moment(selectmonth, "MM/YYYY").year();
    const month = moment(selectmonth, "MM/YYYY").month() + 1;

    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Populate initial data
    const updatedRowData = userList.map((record) => {
      daysArray.forEach((day) => {
        record[day] = isPresent(record.student_id, day);
      });
      return record;
    });
    setRowData(updatedRowData);

    // Configure columns
    const staticCols = [
      { headerName: "ID", field: "student_id",width:100 },
      { headerName: "Name", field: "name" },
    ];

    const dynamicDayCols = daysArray.map((day) => ({
      headerName: `Day ${day}`,
      field: `${day}`,
      width: 120,
      cellRenderer: CheckboxCellRenderer,
      headerComponentFramework: () => (
        <input
          type="checkbox"
          onChange={(e) => handleHeaderCheckboxChange(day, e.target.checked)}
        />
      ),
    }));

    setColDefs([...staticCols, ...dynamicDayCols]);
  }, [attendanceList, selectmonth]);

  const getUniqueRecords = () => {
    const uniqueRecords = [];
    const seenIds = new Set();

    for (const record of attendanceList) {
      if (!seenIds.has(record.student_id)) {
        seenIds.add(record.student_id);
        uniqueRecords.push(record);
      }
    }

    return uniqueRecords;
  };

  const isPresent = (student_id, day) => {
    return attendanceList.some(
      (record) => record.student_id === student_id && record.day === day
    );
  };

  const handleHeaderCheckboxChange = async (day, isChecked) => {
    const updatedData = rowData.map((row) => {
      row[day] = isChecked; // Update each row's value for the day
      return row;
    });

    setRowData(updatedData);

    // Update backend for each student
    for (const row of updatedData) {
      await updateAttendance(row.student_id, day, isChecked);
    }
  };

  const handleCellCheckboxChange = async (params) => {
    const updatedData = [...rowData];
    const rowIndex = updatedData.findIndex(
      (row) => row.student_id === params.data.student_id
    );

    if (rowIndex !== -1) {
      const day = params.colDef.field;
      const newValue = !params.data[day]; // Toggle value
      updatedData[rowIndex][day] = newValue;

      setRowData(updatedData);

      // Update backend
      await updateAttendance(params.data.student_id, day, newValue);
    }
  };

  const updateAttendance = async (student_id, day, present) => {
    const date = moment(selectmonth, "MM/YYYY").format("MM/YYYY");
    const data = { student_id, day, date, present };

    try {
      await GlobalApis.MarkAttendance(data); // Call your API
      toast.success(
        `Attendance ${present ? "marked" : "unmarked"} for Day ${day}`
      );
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const CheckboxCellRenderer = (props) => {
    return (
      <input
        type="checkbox"
        checked={props.value || false}
        onChange={() => handleCellCheckboxChange(props)}
      />
    );
  };

  return (

    <div>
        <SelectAllAttendance
        selectmonth={selectmonth}
        rowData={rowData}
        setRowData={setRowData}
      />

   
    <div className="ag-theme-alpine" style={{ height: 600 }}>
      
     

      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
      />
     
    </div>
    </div>
  );
};

export default AttendanceGrid;