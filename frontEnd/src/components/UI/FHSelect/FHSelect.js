import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';

const FHSelect = (props) => {
    return (
        <FormControl variant="outlined" value={props.value} className={props.styleClass} error={props.hasError}>
            <InputLabel style={{fontSize: 13}}>{props.label}</InputLabel>
            <Select
                name={props.inputName}
                value={props.value}
                onChange={event => { props.onChangeHandler(event, props.key) }}
                label={props.label}>
                {props.menuItems && Object.keys(props.menuItems).map((key, index) => {
                    return <MenuItem key={key} value={key}>{props.menuItems[key]}</MenuItem>
                })}
            </Select>
            {props.hasError ? <FormHelperText>{props.validationErrStr}</FormHelperText> : null}
        </FormControl>
    );
};

export default FHSelect;