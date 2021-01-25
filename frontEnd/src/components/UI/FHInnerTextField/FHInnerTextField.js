import React from 'react';
import TextField from '@material-ui/core/TextField';

const FHInnerTextField = (props) => {
    return (
        <TextField
            // autoFocus={true}
            fullWidth={props.fullWidth}
            onChange={props.inputChangeHandler}
            error={props.hasErr}
            className={props.componentClass}
            helperText={props.hasErr ? props.errStr : ''}
            label={props.label}
            type={props.type}
            // value={props.value}
            variant="outlined"
            {...props.propsToPass}
            InputLabelProps={{
                style: {color: 'black'},
            }}

        />
    );
}

export default FHInnerTextField;