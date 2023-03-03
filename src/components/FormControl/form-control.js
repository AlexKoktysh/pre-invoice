import { useState, useEffect } from "react";
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from "@mui/material";
import "./form-control.scss";

function Form(props) {
    const [value, setValue] = useState(props.value || "");
    const listItems = props.items?.map((item) =>
        <FormControlLabel key={item.index} value={item.value} control={<Radio />} label={item.label} />
    );

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    useEffect(() => {
        value && props.change(value);
    }, [value]);
    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <FormControl className="container">
            <FormLabel id="group-label">{props.label}</FormLabel>
            <RadioGroup key={props.index} id="group" value={value} onChange={handleChange}>
                {listItems}
            </RadioGroup>
        </FormControl>
    );
}

export default Form;