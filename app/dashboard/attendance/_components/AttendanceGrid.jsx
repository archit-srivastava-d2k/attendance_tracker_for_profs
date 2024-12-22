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
        record[day] = isPresent(record.student_id, day); // Set attendance value
      });
      return record;
    });

    setRowData(updatedRowData);

    // Define column definitions
    const staticCols = [
      { headerName: "ID", field: "student_id",filter:true , width: 100 },
      { headerName: "Student Name", field: "name" , filter:true},
    ];

    const dynamicDayCols = daysArray.map((day) => ({
      headerName: `${day}`,
      field: `${day}`,
      editable: true,
      width: 100,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        onCheckboxChange: (params) => handleCheckboxChange(params, day),
      },
    }));

    setColDefs([...staticCols, ...dynamicDayCols]);
  }, [attendanceList, selectmonth]);

  const isPresent = (student_id, day) => {
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

  const handleCheckboxChange = async (params, day) => {
    const updatedData = [...rowData];
    const rowIndex = updatedData.findIndex(
      (row) => row.student_id === params.data.student_id
    );

    if (rowIndex !== -1) {
      const presentStatus = !params.data[day]; // Toggle attendance
      updatedData[rowIndex][day] = presentStatus;
      setRowData(updatedData);

      if (presentStatus) {
        // Call API to mark attendance
        const success = await OnMarkAttendance({
          day,
          student_id: params.data.student_id,
          presentStatus,
        });

        if (!success) {
          // Revert changes in case of an API error
          updatedData[rowIndex][day] = !presentStatus;
          setRowData(updatedData);
        }
      } else {
        // Call API to delete attendance
        const date = moment(selectmonth).format("MM/yyyy");
        const success = await MarkAttendanceDelete({
          student_id: params.data.student_id,
          day,
          date,
        });

        if (!success) {
          // Revert changes in case of an API error
          updatedData[rowIndex][day] = !presentStatus;
          setRowData(updatedData);
        }
      }
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

  const OnMarkAttendance = async ({ day, student_id, presentStatus }) => {
    const date = moment(selectmonth).format("MM/yyyy");
    const data = {
      day,
      student_id,
      present: presentStatus ? 'true' : 'false',
      date,
    };
  
    try {
      await GlobalApis.MarkAttendance(data);
      toast.success(
        `Attendance ${presentStatus ? "marked" : "unmarked"} for Student ID: ${student_id} on Day: ${day}`
      );
      return true;
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to update attendance");
      return false;
    }
  };

  const MarkAttendanceDelete = async ({ student_id, day, date }) => {
    try {
      await GlobalApis.MarkAttendanceDelete({ student_id, day, date });
      toast.success(`Attendance deleted for Student ID: ${student_id} on Day: ${day}`);
      return true;
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error("Failed to delete attendance");
      return false;
    }
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
