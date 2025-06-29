"use client";
import GradeSelection from '@/app/_components/GradeSelection';
import MonthSelection from '@/app/_components/MonthSelection';
import GlobalApis from '@/app/_services/GlobalApis';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import moment from 'moment';
import React, { useState } from 'react';
import AttendanceGrid from './_components/AttendanceGrid';

function Attendance() {
    const [selectgrade, setSelectgrade] = useState([]);
    const [selectmonth, setSelectmonth] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);

    const searchHandler = () => {
        const month = moment(selectmonth).format('MM/YYYY');
        GlobalApis.GetAllAttendanceList(selectgrade, month).then((res) => setAttendanceList(res));
    };

    return (
        <div className='p-4 flex flex-col space-y-6'>
            {/* Header */}
            <div>
                <h2 className='text-xl font-bold'>Attendance</h2>
            </div>

            {/* Filters */}
            <div className='flex flex-col md:flex-row gap-4 items-center border border-gray-300 rounded-md p-4'>
                <div className='flex flex-col md:flex-row gap-2 items-center w-full md:w-auto'>
                    <Label className='text-sm md:w-auto'>Month</Label>
                    <MonthSelection selectmonth={(value) => setSelectmonth(value)} />
                </div>

                <div className='flex flex-col md:flex-row gap-2 items-center w-full md:w-auto'>
                    <Label className='text-sm md:w-auto'>Grade</Label>
                    <GradeSelection selectgrade={(value) => setSelectgrade(value)} />
                </div>

                <div className='w-full md:w-auto'>
                    <Button onClick={searchHandler} className='w-full md:w-auto'>
                        Search
                    </Button>
                </div>
            </div>

            {/* Attendance Grid */}
            <AttendanceGrid attendanceList={attendanceList} selectmonth={selectmonth} />
        </div>
    );
}

export default Attendance;
