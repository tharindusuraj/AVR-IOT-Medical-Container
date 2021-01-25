import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import FHSnackBar, { SNACKBAR } from '../FHSnackBar/FHSnackBar';

const useStyles = makeStyles((theme) => ({
    alertWrap: {
        marginBottom: '15px',
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        textAlign: 'left'
    }
}));

const FHAlert = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.alertWrap}>
            {
                props.alerts.map((alert, index) => {
                    let title = alert.title ? <AlertTitle>{alert.title}</AlertTitle> : null;
                    let alertJSX;
                    if (alert.type === SNACKBAR) {
                        alertJSX = <FHSnackBar key={index} message={alert.message} />;
                    } else {
                        alertJSX = (
                            <Alert id={index} key={index} severity={alert.severity} onClose={() => { props.handleAlertClose(index) }}>
                                {title}
                                {alert.message}
                            </Alert>
                        );
                    }

                    return alertJSX;
                })
            }
        </div>
    );
};

export default FHAlert;