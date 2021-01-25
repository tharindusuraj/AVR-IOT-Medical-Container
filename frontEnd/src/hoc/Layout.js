import React from 'react';

import {connect} from 'react-redux';

import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import DashAppBar from '../components/Layout/DashAppBar';
import DashToolBar from '../components/Layout/DashToolBar';
import {authLogout} from '../store/actions/index';

const drawerWidth = 300;

const APP_NAME = "MedBox : Dashboard";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: '#0a458e',
        height: '100vh'
    },
    content: {
        marginTop: '56px',
        flexGrow: 1,
        backgroundColor: '#0a458e',
        backgroundSize: 'cover',
        height: 'fit-content',
        backgroundPosition: 'right',
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    }
}));

const Layout = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <DashAppBar drawerWidth={drawerWidth}>
                <DashToolBar
                    appName={APP_NAME}
                    isAuthenticated={props.isAuthenticated}
                    onClickLogout={props.logoutHandler}/>
            </DashAppBar>
            <main
                className={classes.content}>
                {props.children}
            </main>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token != null
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutHandler: () => dispatch(authLogout()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);