import React from 'react';
import { Button } from '@material-ui/core';

const FHButton = (props) => {
    return (
        <Button 
            className={props.componentClass}   
            disabled={props.disabled}
            type={props.type}
            variant={props.variant ? props.variant : 'text'}
            onClick={props.onClick}
            color={props.color? props.color : 'primary'}>
            {props.children}
        </Button>
    );
}

export default FHButton;