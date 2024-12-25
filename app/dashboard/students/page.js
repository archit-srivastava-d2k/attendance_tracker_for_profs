"use client"
import React, { useEffect, useState } from 'react'

import AddNewStudent from './_components/addNewStudent'
import GlobalApis from '@/app/_services/GlobalApis';
import StudentListTable from './_components/StudentListTable';

function Student() {
    const [students, setStudents] = useState([]);
  
    useEffect(() => {
      async function GetAllStudents() {
        try {
          const data = await GlobalApis.GetAllStudent();
          console.log("data", data);
          setStudents(data)
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      }
      GetAllStudents();
    }, [])
  
    const refreshData = async () => {
      try {
        const data = await GlobalApis.GetAllStudent();
        setStudents(data)
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  
    return (
      <div className='p-4 flex flex-col '>
        <div className='p-4 flex justify-between items-center'>
          <h2 className="text-xl font-semibold">Students</h2>
          <AddNewStudent refreshData={refreshData}/>
        </div>
        <div className='p-4 flex-1 '>
          <StudentListTable students={students} refreshData={refreshData} />
        </div>
      </div>
    )
  }
export default Student
