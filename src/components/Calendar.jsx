import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

function CalendarDatePicker({ setJoining_Date, userDate }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const datePickerRef = useRef(null);

    const handleIconClick = () => {
        datePickerRef.current.setOpen(true);
    };

    const CustomInput = ({ value, onClick }) => (
        <button
            type="button"
            onClick={handleIconClick}
            className="p-2 rounded-md hover:bg-gray-800 transition"
        >
            <Calendar className="w-6 h-6 text-white" />
        </button>
    );

    //   useEffect(() => {
    //     if (selectedDate) {
    //       setJoining_Date(selectedDate); // ✅ this now works
    //       console.log('Selected Date:', selectedDate);
    //     }
    //   }, [selectedDate, setJoining_Date]);
console.log('selectedDate ', selectedDate)
    return (
        <DatePicker
            ref={datePickerRef}
            selected={selectedDate ? selectedDate : userDate ? userDate : null}
            onChange={(date) => setJoining_Date(date)}
            customInput={<CustomInput />}
            calendarClassName="z-[9999]"
        />
    );
}

export default CalendarDatePicker;
