import React, {useEffect} from 'react';

import {connect, useDispatch, useSelector} from 'react-redux';

import {Grid, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import {green, red} from "@material-ui/core/colors";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from '@material-ui/core/Tooltip';

import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import ManageDevices from "./ManageDevices";


import {loadAllDevices} from "../store/actions/index";
import {loadDeviceInfo} from "../store/actions/dashboard";
import RegisterDevice from "./RegisterDevice";
import companyLogo from "./Auth/logo.jpg";

// Styling
const generalPaper = (theme) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
});

const backgroundSide = '#ffffff';

const useStyle = makeStyles(theme => ({
    container: {
        height: '100%'
    },
    generalPaper: {
        ...generalPaper(theme),
        height: '100%'
    },
    lhsPaperA: {
        ...generalPaper(theme),
        background: backgroundSide,
    },
    lhsPaperB: {
        ...generalPaper(theme),
        background: backgroundSide,
    },
    insidePaper: {
        maxHeight: 1000,
        overflow: 'auto',
        height: '55vh',
        marginLeft: theme.spacing(2),
        margin: theme.spacing(1)
    },
    divDevicesList: {
        width: '100%',
        maxWidth: 300,
    },
    image: {
        backgroundImage: `url(${companyLogo})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#3475c5',
        backgroundSize: '90%',
        backgroundPosition: 'right',
    },
}));

//Components
const AppWrapper = (props) => {
    const devices = useSelector(state => state.devices);
    const deviceList = convertToDeviceArray(devices);

    const selectedDevice = useSelector(state => state.selectedDevice);
    const deviceInfo = selectedDevice !== undefined ?
        {
            device: selectedDevice.device,
            active: selectedDevice.status,
            timeRange: selectedDevice.timeRange,
            logs: selectedDevice.logs
        } : {
            device: null
        };

    const dispatch = useDispatch()

    const classes = useStyle();

    const handleDeviceOnclick = (device) => {
        dispatch(loadDeviceInfo(device.key));
    };

    const propagateItems = (
        deviceList.map(device => {
            return (
                <ListItem
                    selected={deviceInfo.device === device.key}
                    button
                    key={device.key}
                    onClick={(event) => handleDeviceOnclick(device)}>
                    <Tooltip title={device.active ? 'Active' : 'Inactive'}>
                        <ListItemIcon>
                            <RadioButtonCheckedIcon
                                style={{color: green[500]}}/>
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary={`${device.label} : ${device.client}`}/>
                </ListItem>
            );
        })
    );

    const deviceItemsWrapper = (items) => {
        return (<React.Fragment>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        className={classes.insidePaper}>
                        <div className={classes.divDevicesList}>
                            <List>
                                {items}
                            </List>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>)
    };

    useEffect(() => {
        dispatch(loadAllDevices());
    }, [dispatch]);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
                <Grid item xs={3} className={classes.top}>
                    <Grid container
                          direction="column"
                          justify="flex-start"
                          alignItems="stretch"
                          spacing={1}>
                        <Grid item xs={12}>
                            <Paper
                                elevation={5}
                                className={classes.lhsPaperA}>
                                <RegisterDevice/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                elevation={5}
                                className={classes.lhsPaperB}>
                                <Typography
                                    variant="h6"
                                    align="left"
                                    color="textPrimary">
                                    Registered Device List
                                </Typography>
                                {deviceItemsWrapper(propagateItems)}
                            </Paper>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs={9}>
                    <ManageDevices/>
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    );

};

// helper functions
const convertToDeviceArray = (devices) =>
    Object.keys(devices).map((key) => ({
        key: key,
        active: devices[key] && devices[key].deviceExpiry > new Date().getTime(),
        label: key,
        client: devices[key] && devices[key].client
    }))

export default connect()(AppWrapper);