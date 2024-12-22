"use client"
import React, { use, useEffect, useState } from 'react'

import AddNewStudent from './_components/addNewStudent'
import GlobalApis from '@/app/_services/GlobalApis';
import StudentListTable from './_components/StudentListTable';

function student() {
    const [students, setStudents] = useState([]);
  
    useEffect(() => {
      async function GetAllStudents() {
        try {
          const data = await GlobalApis.GetAllStudent();
          console.log("data", data);
          setStudents(data)
        } catch (error) {
          console.error("Error fetching grades:", error);
        }
      }
      GetAllStudents();
    }, [])
  
    const refreshData = async () => {
      try {
        const data = await GlobalApis.GetAllStudent();
        setStudents(data)
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    }
  
    return (
      <div>
        <div className='p-4 flex justify-between'>
          <div>
            <h2>student</h2>
          </div>
          <div className='px-6'>
            <AddNewStudent />
          </div>
        </div>
        <div className='p-4'>
          <StudentListTable students={students} refreshData={refreshData} />
        </div>
      </div>
    )
  }
export default student
