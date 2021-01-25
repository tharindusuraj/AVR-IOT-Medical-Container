import React, { useCallback, useState } from 'react';
import { Snackbar, IconButton } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close';

export const SNACKBAR = 'SNACKBAR';

const FHSnackBar = (props) => {
    const [open, setOpen] = useState(true);

    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }, []);;

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={props.timeout || 6000}
            onClose={handleClose}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }>
            <Alert onClose={handleClose} severity={props.severity}>
                {props.message}
            </Alert>
        </Snackbar>
    );
}

export default FHSnackBar;