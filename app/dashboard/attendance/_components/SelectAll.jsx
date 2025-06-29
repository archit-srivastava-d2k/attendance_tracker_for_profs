"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import moment from "moment";
import GlobalApis from "@/app/_services/GlobalApis";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Calendar, ChevronDown } from "lucide-react";

const SelectAllAttendance = ({ selectmonth, rowData, setRowData }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to calculate attendance percentage
  const calculateAttendancePercentage = (record, totalDays) => {
    const presentDays = Object.keys(record)
      .filter((key) => !isNaN(key) && record[key] === true)
      .length;
    return ((presentDays / totalDays) * 100).toFixed(1);
  };

  useEffect(() => {
    const year = moment(selectmonth, "MM/YYYY").year();
    const month = moment(selectmonth, "MM/YYYY").month() + 1;
    const days = Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
    setDaysInMonth(days);
  }, [selectmonth]);

  const handleDropdownChange = async (event) => {
    const selectedDay = event.target.value;
    if (!selectedDay) return;

    // Check if all students are already marked present
    const alreadyMarked = rowData.every((row) => row[selectedDay]);

    if (alreadyMarked) {
      toast.info(`All attendance for Day ${selectedDay} is already marked.`, {
        icon: <CheckSquare className="h-4 w-4" />
      });
      return;
    }

    const isMarked = window.confirm(
      `Do you want to mark all students as present for Day ${selectedDay}?`
    );

    if (!isMarked) return;

    setLoading(true);
    try {
      const year = moment(selectmonth, "MM/YYYY").year();
      const month = moment(selectmonth, "MM/YYYY").month() + 1;
      const totalDaysInMonth = new Date(year, month, 0).getDate();

      // Prepare bulk update payload - Fixed: using student_id instead of id
      const updates = rowData.map((row) => ({
        student_id: row.student_id, // Fixed: was row.id
        day: parseInt(selectedDay),
        present: true,
        date: selectmonth, // Format: MM/YYYY
      }));

      // Call backend API to update attendance in bulk
      await GlobalApis.bulkMarkAttendance(updates);

      // Update local state with recalculated attendance percentage
      const updatedRows = rowData.map((row) => {
        const updatedRow = {
          ...row,
          [selectedDay]: true,
        };
        // Recalculate attendance percentage
        updatedRow.attendancePercentage = calculateAttendancePercentage(updatedRow, totalDaysInMonth);
        return updatedRow;
      });

      setRowData(updatedRows);
      
      toast.success(`All students marked present for Day ${selectedDay}.`, {
        icon: <CheckSquare className="h-4 w-4" />,
      });
    } catch (error) {
      console.error("Error marking bulk attendance:", error);
      toast.error("Failed to mark all students present. Please try again.");
    } finally {
      setLoading(false);
      setSelectedDay(""); // Reset dropdown
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center gap-4 p-4">
        <label htmlFor="select-day" className="flex items-center gap-2 text-gray-700 font-medium">
          <Calendar className="h-4 w-4" />
          Select Day:
        </label>
        <select
          id="select-day"
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
          value={selectedDay}
          onChange={handleDropdownChange}
          disabled={loading}
          style={{
            colorScheme: 'light',
            backgroundColor: 'white',
            color: '#111827'
          }}
        >
          <option value="">-- Select Day --</option>
          {daysInMonth.map((day) => (
            <option key={day} value={day} style={{ backgroundColor: 'white', color: '#111827' }}>
              Day {day}
            </option>
          ))}
        </select>
        {loading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Updating...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectAllAttendance;