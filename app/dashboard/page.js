"use client";
import GradeSelection from '@/app/_components/GradeSelection';
import MonthSelection from '@/app/_components/MonthSelection';
import GlobalApis from '@/app/_services/GlobalApis';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, GraduationCapIcon, SearchIcon, Users } from 'lucide-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import AttendanceGrid from './attendance/_components/AttendanceGrid';

function Attendance() {
    const [selectgrade, setSelectgrade] = useState('');
    const [selectmonth, setSelectmonth] = useState(new Date());
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Load saved values from localStorage on component mount
    useEffect(() => {
        const savedGrade = localStorage.getItem('attendance_selected_grade');
        const savedMonth = localStorage.getItem('attendance_selected_month');
        
        if (savedGrade) {
            setSelectgrade(savedGrade);
        }
        
        if (savedMonth) {
            setSelectmonth(new Date(savedMonth));
        }

        // Auto-search if both values are available
        if (savedGrade && savedMonth) {
            performSearch(savedGrade, new Date(savedMonth));
        }
    }, []);

    // Save values to localStorage whenever they change
    useEffect(() => {
        if (selectgrade) {
            localStorage.setItem('attendance_selected_grade', selectgrade);
        }
    }, [selectgrade]);

    useEffect(() => {
        if (selectmonth) {
            localStorage.setItem('attendance_selected_month', selectmonth.toISOString());
        }
    }, [selectmonth]);

    const performSearch = async (grade = selectgrade, month = selectmonth) => {
        if (!grade || !month) {
            return;
        }

        setLoading(true);
        try {
            const monthStr = moment(month).format('MM/YYYY');
            const res = await GlobalApis.GetAllAttendanceList(grade, monthStr);
            setAttendanceList(res);
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchHandler = () => {
        performSearch();
    };

    const clearFilters = () => {
        setSelectgrade('');
        setSelectmonth(new Date());
        setAttendanceList([]);
        setHasSearched(false);
        localStorage.removeItem('attendance_selected_grade');
        localStorage.removeItem('attendance_selected_month');
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
            <div className='p-6 max-w-7xl mx-auto space-y-8'>
                {/* Header Section */}
                <div className='text-center space-y-2'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        Student Attendance
                    </h1>
                    <p className='text-gray-600 text-lg'>
                        Track and manage student attendance efficiently
                    </p>
                </div>

                {/* Filters Card */}
                <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                    <CardHeader className='pb-4'>
                        <CardTitle className='flex items-center gap-2 text-xl'>
                            <SearchIcon className='h-5 w-5 text-blue-600' />
                            Search Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 items-end'>
                            {/* Month Selection */}
                            <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                    <CalendarIcon className='h-4 w-4 text-blue-500' />
                                    Select Month
                                </Label>
                                <div className='relative'>
                                    <MonthSelection 
                                        selectmonth={(value) => setSelectmonth(value)} 
                                        defaultValue={selectmonth}
                                    />
                                </div>
                            </div>

                            {/* Grade Selection */}
                            <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                    <GraduationCapIcon className='h-4 w-4 text-purple-500' />
                                    Select Grade
                                </Label>
                                <div className='relative'>
                                    <GradeSelection 
                                        selectgrade={(value) => setSelectgrade(value)} 
                                        defaultValue={selectgrade}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2'>
                                <Button 
                                    onClick={searchHandler} 
                                    disabled={!selectgrade || !selectmonth || loading}
                                    className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md'
                                >
                                    {loading ? (
                                        <div className='flex items-center gap-2'>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                            Searching...
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <SearchIcon className='h-4 w-4' />
                                            Search
                                        </div>
                                    )}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={clearFilters}
                                    className='hover:bg-gray-50'
                                >
                                    Clear
                                </Button>
                            </div>

                            {/* Stats Display */}
                            {hasSearched && (
                                <div className='flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg'>
                                    <Users className='h-4 w-4 text-blue-500' />
                                    <span>
                                        Found {attendanceList.length} records for{' '}
                                        <span className='font-medium text-blue-700'>{selectgrade}</span>
                                        {' '}in{' '}
                                        <span className='font-medium text-blue-700'>
                                            {moment(selectmonth).format('MMMM YYYY')}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Grid */}
                {hasSearched && (
                    <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                        <CardHeader className='pb-4'>
                            <CardTitle className='flex items-center gap-2 text-xl'>
                                <Users className='h-5 w-5 text-green-600' />
                                Attendance Grid
                                <span className='text-sm font-normal text-gray-500 ml-auto'>
                                    {moment(selectmonth).format('MMMM YYYY')} - Grade {selectgrade}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='p-6'>
                            {attendanceList.length > 0 ? (
                                <AttendanceGrid 
                                    attendanceList={attendanceList} 
                                    selectmonth={selectmonth} 
                                />
                            ) : (
                                <div className='text-center py-12'>
                                    <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                        <Users className='h-12 w-12 text-gray-400' />
                                    </div>
                                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                                        No students found
                                    </h3>
                                    <p className='text-gray-500'>
                                        No students are enrolled in grade {selectgrade} or no data available for the selected period.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Help Text */}
                {!hasSearched && (
                    <Card className='border-dashed border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'>
                        <CardContent className='text-center py-12'>
                            <div className='w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center'>
                                <SearchIcon className='h-8 w-8 text-blue-500' />
                            </div>
                            <h3 className='text-lg font-medium text-gray-900 mb-2'>
                                Select filters to view attendance
                            </h3>
                            <p className='text-gray-500 max-w-md mx-auto'>
                                Choose a month and grade from the filters above to view and manage student attendance records.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default Attendance;