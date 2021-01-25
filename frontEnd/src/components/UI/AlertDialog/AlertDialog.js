import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const AlertDialog = (props) => {
    const [open, setOpen] = React.useState(false);

    const {
        dialogOpenButtonIcon,
        ariaLabel,
        ariaDescription,
        tooltip,
        title,
        description,
        affirmativeAction,
        negativeAction
    } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAffirmative = () => {
        if (affirmativeAction.callback !== undefined) {
            affirmativeAction.callback()
        }
        setOpen(false);
    };

    const handleClose = () => {
        if (negativeAction.callback !== undefined) {
            negativeAction.callback()
        }
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Tooltip title={tooltip}>
                <IconButton
                    onClick={handleClickOpen}
                    color='secondary'
                    aria-label="delete" >
                    {dialogOpenButtonIcon !== undefined ?
                        React.cloneElement(dialogOpenButtonIcon)
                        : 'Open alert dialog'}
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby={ariaLabel}
                aria-describedby={ariaDescription}
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAffirmative} color="primary">
                        {affirmativeAction.title}
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        {negativeAction.title}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AlertDialog;