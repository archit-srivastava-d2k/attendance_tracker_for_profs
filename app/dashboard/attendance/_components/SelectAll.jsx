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
      // Prepare bulk update payload
      const updates = rowData.map((row) => ({
        studentId: row.id,
        day: selectedDay,
        present: true,
        month: selectmonth,
      }));
      // Call backend API to update attendance in bulk
      await GlobalApis.bulkMarkAttendance(updates);
      // Update local state
      const updatedRows = rowData.map((row) => ({
        ...row,
        [selectedDay]: true,
      }));
      setRowData(updatedRows);
      toast.success(`All students marked present for Day ${selectedDay}.`, {
        icon: <CheckSquare className="h-4 w-4" />,
      });
    } catch (error) {
      toast.error("Failed to mark all students present. Please try again.");
    } finally {
      setLoading(false);
      setSelectedDay("");
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center gap-4 p-4">
        <label htmlFor="select-day" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Select Day:
        </label>
        <select
          id="select-day"
          className="border rounded px-2 py-1"
          value={selectedDay}
          onChange={handleDropdownChange}
          disabled={loading}
        >
          <option value="">-- Select Day --</option>
          {daysInMonth.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        {loading && <span className="text-sm text-gray-500">Updating...</span>}
      </CardContent>
    </Card>
  );
};

export default SelectAllAttendance;