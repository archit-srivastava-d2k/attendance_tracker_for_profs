
"use client"
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { addMonths } from "date-fns"
import moment from 'moment'
import { Calendar } from "@/components/ui/calendar"

const MonthSelection = ({ selectmonth }) => {
    const handleMonthSelect = (value) => {
        setMonth(value);
        selectmonth(value); // Call the selectmonth prop with the selected month
      };
    const today = new Date();
    const nextMonth = addMonths(today, 0);
    const [month, setMonth] = useState(nextMonth);

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        {
                            moment(month).format("MM/YYYY")
                        }
                    </Button>
                </PopoverTrigger >
                <PopoverContent>
                    <Calendar
                         
                        mode="single"
                        selected={month}
                        onSelect={handleMonthSelect}
                        className="rounded-md border"
                    />
                </PopoverContent>
            </Popover>

        </div>
    )
}

export default MonthSelection
