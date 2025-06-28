"use client"
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import GlobalApis from '../_services/GlobalApis';
import { Button } from '@/components/ui/button';
import { ChevronDown, GraduationCap } from 'lucide-react';

const GradeSelection = ({ selectgrade, defaultValue = '' }) => {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(defaultValue);

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

    useEffect(() => {
        setSelectedGrade(defaultValue);
    }, [defaultValue]);

    const handleGradeChange = (value) => {
        setSelectedGrade(value);
        selectgrade(value);
    };

    return (
        <div className="relative">
            <select 
                value={selectedGrade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
            >
                <option value="" className="text-gray-500">Select Grade</option>
                {grades.map((grade) => (
                    <option key={grade.id} value={grade.grade} className="text-gray-900">
                        Grade {grade.grade}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
        </div>
    )
}

export default GradeSelection