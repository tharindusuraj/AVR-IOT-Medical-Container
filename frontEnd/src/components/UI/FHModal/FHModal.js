import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        backgroundColor: "#ffff",
        boxShadow: 5,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
}));

const FHModal = ((props) => {
    const classes = useStyles();

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div className={classes.paper}>
            {props.body}
            </div>
        </Modal>
    );
});

export default FHModal;