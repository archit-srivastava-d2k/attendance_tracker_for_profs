"use client"
import React, { useState, useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { addMonths } from "date-fns"
import moment from 'moment'
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'

const MonthSelection = ({ selectmonth, defaultValue }) => {
    const today = new Date();
    const [month, setMonth] = useState(defaultValue || today);

    useEffect(() => {
        if (defaultValue) {
            setMonth(defaultValue);
        }
    }, [defaultValue]);

    const handleMonthSelect = (value) => {
        if (value) {
            setMonth(value);
            selectmonth(value);
        }
    };

    return (
        <div className="w-full">
            <Popover>
                <PopoverTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">
                            {moment(month).format("MMMM YYYY")}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-lg" align="start">
                    <Calendar
                        mode="single"
                        selected={month}
                        onSelect={handleMonthSelect}
                        initialFocus
                        className="rounded-md border-0"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default MonthSelection