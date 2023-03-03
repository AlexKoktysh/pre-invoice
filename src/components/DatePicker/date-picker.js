import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment/moment.js";

function DatePickerControl(props) {
    const setPropsDate = (value) => {
        const propsDate = props.item.value.includes(".");
        return propsDate ? moment(props.item.value, 'DD.MM.YYYY') : moment(props.item.value, 'YYYY-MM-DD')
    };
    const defaultDate = props.item.value ? setPropsDate(props.item.value).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    const [date, setDate] = useState(defaultDate);
    const change = (value) => {
        const date = moment(value.$d).format('YYYY-MM-DD');
        setDate(date);
        props.change(props.item.label, date);
    };
    useEffect(() => {
        setDate(defaultDate);
        props.change(props.item.label, defaultDate);
    }, [defaultDate]);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                inputFormat="DD.MM.YYYY"
                value={date}
                label={props.item.label}
                onChange={(newValue) => change(newValue)}
                renderInput={(params) => <TextField {...params} size="small" />}
                disabled={props.item.disabled}
            />
        </LocalizationProvider>
    );
}

export default DatePickerControl;