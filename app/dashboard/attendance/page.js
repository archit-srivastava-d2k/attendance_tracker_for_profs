"use client"
import GradeSelection from '@/app/_components/GradeSelection'
import MonthSelection from '@/app/_components/MonthSelection'
import GlobalApis from '@/app/_services/GlobalApis'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import moment from 'moment'
import React, { useState } from 'react'
import AttendanceGrid from './_components/AttendanceGrid'


function attendance() {

   

    const [selectgrade, setSelectgrade] = useState([]);
    const [selectmonth, setSelectmonth] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const searchHandler=()=>{
        console.log(selectgrade,selectmonth)
        const month = moment(selectmonth).format('MM/YYYY');

        GlobalApis.GetAllAttendanceList(selectgrade,month).then((res)=>setAttendanceList(res))
    }
    return (
<div className='p-4 flex flex-col'>


        <div>
             <h2>attendance</h2>
        </div>
        <div className='flex gap-4 items-center border border-gray-300 rounded-md p-4'>
            

            <div className='flex gap-2 items-center'>
                <Label>Month</Label>
                <MonthSelection selectmonth={(value) => setSelectmonth(value)} />
            </div>

            <div    className='flex gap-2 items-center'>
            <Label>Grade</Label>
                <GradeSelection selectgrade={(value) => setSelectgrade(value)} />
            </div>

            <div>
            <Button onClick={()=>searchHandler()}>Search</Button>
            </div>
        </div>
        <AttendanceGrid attendanceList={attendanceList} selectmonth={selectmonth}/>
        </div>
    )
}

export default attendance
