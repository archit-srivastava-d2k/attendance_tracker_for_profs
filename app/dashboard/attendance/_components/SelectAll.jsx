"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import moment from "moment";
import GlobalApis from "@/app/_services/GlobalApis";

const SelectAllAttendance = ({ selectmonth, rowData, setRowData }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [daysInMonth, setDaysInMonth] = useState([]);

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
      toast.info(`All attendance for Day ${selectedDay} is already marked.`);
      return;
    }

    const isMarked = window.confirm(
      `Do you want to mark all attendance for Day ${selectedDay}?`
    );

    if (isMarked) {
      const updatedData = rowData.map((row) => {
        row[selectedDay] = true; // Mark all rows for the selected day as present
        return row;
      });

      setRowData(updatedData);

      // Update backend for all students for the selected day
      for (const row of updatedData) {
        await updateAttendance(row.student_id, selectedDay, true);
      }

      toast.success(`Attendance marked for Day ${selectedDay}`);
      setSelectedDay(""); // Reset dropdown
    }
  };

  const updateAttendance = async (student_id, day, present) => {
    const date = moment(selectmonth, "MM/YYYY").format("MM/YYYY");
    const data = { student_id, day, date, present };

    try {
      await GlobalApis.MarkAttendance(data); // Call your API
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  return (
    <div className="mb-4 flex gap-3 items-center">
      <label htmlFor="day-select" className="block text-gray-700">
        Mark all attendance for a day
      </label>
      <select
        id="day-select"
        value={selectedDay}
        onChange={handleDropdownChange}
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">-- Select Day --</option>
        {daysInMonth.map((day) => (
          <option key={day} value={day}>
            Day {day}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectAllAttendance;
