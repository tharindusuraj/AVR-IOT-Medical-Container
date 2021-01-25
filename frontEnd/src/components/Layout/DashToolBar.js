import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import FHButton from '../UI/FHButton/FHButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
const DEFAULT_APP_NAME = "APP_NAME: UNDEFINED";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    toolbarTitle: {
        display: 'inline-flex',
        fontFamily: 'monospace',
        fontWeight:'bold',

        color:'#2264c4'
    },
    fhToolbar: {
        justifyContent: 'space-between',
        background: '#adea6a'   // TODO: Send style-configs from outside
    }
}));

const DashToolBar = (props) => {
    const classes = useStyles();

    const APP_NAME = props.appName !== undefined ? props.appName : DEFAULT_APP_NAME;

    return (
        <Toolbar className={classes.fhToolbar}>
            <div>
                <Typography className={classes.toolbarTitle} variant="h5" noWrap>
                    {APP_NAME}
                </Typography>
            </div>
            <FHButton onClick={props.onClickLogout} className={classes.toolbarTitle} >Logout</FHButton>
        </Toolbar>
    );
};

export default DashToolBar;