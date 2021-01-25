import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Spinner = (props) => {
    return (
        <CircularProgress size={props.size} />
    );
}

export default Spinner;