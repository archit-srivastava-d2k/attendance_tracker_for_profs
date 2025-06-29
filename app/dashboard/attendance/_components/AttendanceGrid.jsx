"use client";
import React, { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, provideGlobalGridOptions } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";
import GlobalApis from "@/app/_services/GlobalApis";
import { toast } from "sonner";
import SelectAllAttendance from "./SelectAll";
import { Card, CardContent, Calendar, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Users } from "lucide-react";

// AG Grid setup
LicenseManager.setLicenseKey("your License Key");
ModuleRegistry.registerModules([AllEnterpriseModule]);
provideGlobalGridOptions({ theme: "legacy" });

const AttendancePercentageCellRenderer = (props) => {
  const percentage = parseFloat(props.value) || 0;
  let color = "#ef4444"; // red
  if (percentage >= 90) color = "#10b981"; // green
  else if (percentage >= 75) color = "#f59e0b"; // yellow
  else if (percentage >= 60) color = "#f97316"; // orange

  return <div style={{ color, fontWeight: 600 }}>{percentage.toFixed(1)}%</div>;
};

const AttendanceGrid = ({ attendanceList, selectmonth }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalStudents: 0,
    totalDays: 0,
    averageAttendance: 0,
  });

  const calculateAttendancePercentage = useCallback((record, daysInMonth) => {
    const presentDays = Object.keys(record)
      .filter((key) => !isNaN(key) && record[key] === true)
      .length;
    return ((presentDays / daysInMonth) * 100).toFixed(1);
  }, []);

  useEffect(() => {
    const userList = getUniqueRecords();
    const year = moment(selectmonth, "MM/YYYY").year();
    const month = moment(selectmonth, "MM/YYYY").month() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const updatedRowData = userList.map((record) => {
      const updatedRecord = { ...record };
      let presentDays = 0;
      daysArray.forEach((day) => {
        const isPresent = isPresentFunc(record.student_id, day);
        updatedRecord[day] = isPresent;
        if (isPresent) presentDays++;
      });
      updatedRecord.attendancePercentage = ((presentDays / daysInMonth) * 100).toFixed(1);
      return updatedRecord;
    });

    setRowData(updatedRowData);

    const totalAttendance = updatedRowData.reduce(
      (sum, student) => sum + parseFloat(student.attendancePercentage || 0),
      0
    );
    const avgAttendance =
      updatedRowData.length > 0 ? (totalAttendance / updatedRowData.length).toFixed(1) : 0;

    setAttendanceStats({
      totalStudents: updatedRowData.length,
      totalDays: daysInMonth,
      averageAttendance: avgAttendance,
    });

    const staticCols = [
      {
        headerName: "ID",
        field: "student_id",
        width: 80,
        cellStyle: { fontWeight: "bold", color: "#374151" },
      },
      {
        headerName: "Student Name",
        field: "name",
        width: 160,
        cellStyle: { fontWeight: "500", color: "#111827" },
      },
      {
        headerName: "Attendance %",
        field: "attendancePercentage",
        width: 130,
        cellRenderer: AttendancePercentageCellRenderer,
      },
    ];

    const dynamicDayCols = daysArray.map((day) => ({
      headerName: `${day}`,
      field: `${day}`,
      width: 50,
      cellRenderer: CheckboxCellRenderer,
      headerComponent: () => CustomHeaderComponent(day),
      cellStyle: (params) => ({
        padding: "8px",
        textAlign: "center",
        backgroundColor: params.value ? "#dcfce7" : "#fef2f2",
      }),
    }));

    setColDefs([...staticCols, ...dynamicDayCols]);
  }, [attendanceList, selectmonth, calculateAttendancePercentage]);

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

  const isPresentFunc = (student_id, day) => {
    return attendanceList.some(
      (record) => record.student_id === student_id && record.day === day
    );
  };

  const CustomHeaderComponent = (day) => {
    return (
      <div className="flex flex-col items-center p-1">
        <span className="text-xs font-medium text-gray-700">{day}</span>
        <input
          type="checkbox"
          className="mt-1 h-3 w-3 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          onChange={(e) => handleHeaderCheckboxChange(day, e.target.checked)}
        />
      </div>
    );
  };

  const handleHeaderCheckboxChange = async (day, isChecked) => {
    const year = moment(selectmonth, "MM/YYYY").year();
    const month = moment(selectmonth, "MM/YYYY").month() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const updatedData = rowData.map((row) => {
      const updatedRow = { ...row, [day]: isChecked };
      updatedRow.attendancePercentage = calculateAttendancePercentage(updatedRow, daysInMonth);
      return updatedRow;
    });

    setRowData(updatedData);

    for (const row of updatedData) {
      await updateAttendance(row.student_id, day, isChecked);
    }
  };

  const handleCellCheckboxChange = async (params) => {
    const year = moment(selectmonth, "MM/YYYY").year();
    const month = moment(selectmonth, "MM/YYYY").month() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const updatedData = [...rowData];
    const rowIndex = updatedData.findIndex(
      (row) => row.student_id === params.data.student_id
    );

    if (rowIndex !== -1) {
      const day = params.colDef.field;
      const newValue = !params.data[day];
      updatedData[rowIndex][day] = newValue;
      updatedData[rowIndex].attendancePercentage = calculateAttendancePercentage(
        updatedData[rowIndex],
        daysInMonth
      );

      setRowData(updatedData);

      await updateAttendance(params.data.student_id, day, newValue);
    }
  };

  const updateAttendance = async (student_id, day, present) => {
    const date = moment(selectmonth, "MM/YYYY").format("MM/YYYY");
    const data = { student_id, day, date, present };

    try {
      await GlobalApis.MarkAttendance(data);
      toast.success(`Attendance ${present ? "marked" : "unmarked"} for Day ${day}`, {
        icon: present ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />,
      });
    } catch (error) {
      toast.error("Failed to update attendance");
      setRowData((prevData) =>
        prevData.map((row) =>
          row.student_id === student_id ? { ...row, [day]: !present } : row
        )
      );
    }
  };

  const CheckboxCellRenderer = (props) => {
    return (
      <div className="flex items-center justify-center h-full">
        <input
          type="checkbox"
          checked={props.value || false}
          onChange={() => handleCellCheckboxChange(props)}
          className="h-4 w-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-blue-800">
                  {attendanceStats.totalStudents}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-green-600 font-medium">Average Attendance</p>
                <p className="text-2xl font-bold text-green-800">
                  {attendanceStats.averageAttendance}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-purple-600 font-medium">Days in Month</p>
                <p className="text-2xl font-bold text-purple-800">
                  {attendanceStats.totalDays}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      <SelectAllAttendance selectmonth={selectmonth} rowData={rowData} setRowData={setRowData} />

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="ag-theme-alpine" style={{ height: 600 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              animateRows={true}
              pagination={true}
              paginationPageSize={15}
              suppressCellFocus={true}
              rowHeight={50}
              headerHeight={60}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-700">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-gray-700">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">≥90% Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">&lt;60% Attendance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceGrid;
