"use client"
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import GlobalApis from '../_services/GlobalApis';
import { Button } from '@/components/ui/button';


const GradeSelection = ({selectgrade}) => {

    const [grades, setGrades] = useState([]);
    useEffect(() => {
        async function getAllGradesList() {
            try {
                const data = await GlobalApis.GetAllGrades();
                console.log("data", data);
                setGrades(data)
            } catch (error) {
                console.error("Error fetching grades:", error);
            }
        }
        getAllGradesList();
    }, []);
    return (
        <div>
            <div>
           
                <select onChange={(e) => selectgrade(e.target.value)}  >
                    {grades.map((grade) => (
                        <option key={grade.id} value={grade.grade}>
                            {grade.grade}
                        </option>
                    ))}
                </select>
                

            </div>


        </div>
    )
}

export default GradeSelection
