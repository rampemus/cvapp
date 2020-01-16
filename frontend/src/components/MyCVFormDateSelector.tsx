import React, { useState, useEffect } from 'react'

interface OwnProps {
    date: Date,
    handleChange(newDate:Date): void,
}

const numbers = (from:number, to:number) => {
    let result = []
    for ( let i = 0; i < to-from; i++) {
        result.push(from+i)
    }
    return result
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const MyCVFormDateSelector: React.FC<OwnProps> = (props) => {

    const dateProp = new Date(props.date)

    const [year, setYear] = useState(dateProp.getFullYear())
    const [month, setMonth] = useState(dateProp.getMonth())
    const [day, setDay] = useState(dateProp.getDate())
    const [lastDayOfTheMonth, setLastDayOfTheMonth] = useState(31)

    useEffect(()=>{
        setLastDayOfTheMonth(new Date(year, month + 1, 0).getDate())
    },[year,month])

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault()
        const newYear = parseInt(event.target.value)
        setYear(newYear)
        props.handleChange(new Date(newYear,month,day))
    }

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault()
        const newMonth = parseInt(event.target.value)
        setMonth(newMonth)
        props.handleChange(new Date(year, newMonth, day))
    }

    const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault()
        const newDay = parseInt(event.target.value)
        setDay(newDay)
        props.handleChange(new Date(year, month, newDay))
    }

    return(
        <div>
            <select onChange={handleYearChange} value={year}>
                {numbers(2000,2030).map((yearNumber) => {
                    return (<option key={yearNumber} value={yearNumber}>{yearNumber}</option>)
                })}
            </select>
            /
            <select onChange={handleMonthChange} value={month}>
                {numbers(0, 12).map((monthNumber) => {
                    return (<option key={monthNumber} value={monthNumber}>{months[monthNumber]}</option>)
                })}
            </select>
            /
            <select onChange={handleDayChange} value={day}>
                {numbers(1, lastDayOfTheMonth+1).map((dayNumber) => {
                    return (<option key={dayNumber} value={dayNumber}>{dayNumber}</option>)
                })}
            </select> 
        </div>
    )
}

export default MyCVFormDateSelector
