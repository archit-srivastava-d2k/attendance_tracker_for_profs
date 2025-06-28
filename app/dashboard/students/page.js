"use client"
import React, { useEffect, useState } from 'react'
import AddNewStudent from './_components/addNewStudent'
import GlobalApis from '@/app/_services/GlobalApis';
import StudentListTable from './_components/StudentListTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, GraduationCap, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function Student() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        byGrade: {}
    });

    useEffect(() => {
        async function GetAllStudents() {
            try {
                setLoading(true);
                const data = await GlobalApis.GetAllStudent();
                console.log("data", data);
                setStudents(data);
                calculateStats(data);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        }
        GetAllStudents();
    }, [])

    const calculateStats = (studentData) => {
        const total = studentData.length;
        const byGrade = studentData.reduce((acc, student) => {
            acc[student.grade] = (acc[student.grade] || 0) + 1;
            return acc;
        }, {});
        
        setStats({ total, byGrade });
    };

    const refreshData = async () => {
        try {
            const data = await GlobalApis.GetAllStudent();
            setStudents(data);
            calculateStats(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <GraduationCap className="h-8 w-8 text-blue-600" />
                        </div>
                        Student Management
                    </h1>
                    <p className="text-gray-600">Manage your students and track their information</p>
                </div>
                <AddNewStudent refreshData={refreshData} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">
                            Total Students
                        </CardTitle>
                        <Users className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs opacity-80">
                            Active students in system
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">
                            Grades
                        </CardTitle>
                        <BookOpen className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Object.keys(stats.byGrade).length}</div>
                        <p className="text-xs opacity-80">
                            Different grade levels
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">
                            Grade Distribution
                        </CardTitle>
                        <GraduationCap className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-1">
                            {Object.entries(stats.byGrade).slice(0, 3).map(([grade, count]) => (
                                <Badge key={grade} variant="secondary" className="bg-white/20 text-white text-xs">
                                    {grade}: {count}
                                </Badge>
                            ))}
                            {Object.keys(stats.byGrade).length > 3 && (
                                <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                                    +{Object.keys(stats.byGrade).length - 3}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Students Table */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl text-gray-900">Students List</CardTitle>
                            <CardDescription className="mt-1">
                                View and manage all registered students
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            {stats.total} students
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                <UserPlus className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                            <p className="text-gray-500 mb-4">Get started by adding your first student</p>
                            <AddNewStudent refreshData={refreshData} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Total: {stats.total}
                                </Badge>
                                {Object.entries(stats.byGrade).map(([grade, count]) => (
                                    <Badge key={grade} variant="outline" className="bg-gray-50 text-gray-700">
                                        {grade}: {count} students
                                    </Badge>
                                ))}
                            </div>
                            <StudentListTable students={students} refreshData={refreshData} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Student