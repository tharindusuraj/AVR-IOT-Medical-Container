import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Spinner from '../Spinner/Spinner';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import FHInnerTextField from "../FHInnerTextField/FHInnerTextField";


const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        paddingTop: theme.spacing(0),
        textAlign: "center",
        height: '100%'
    },
    spinner: {
        width: '20px',
        height: '20px'
    },
    deleteBtn: {
        marginLeft: theme.spacing(3)
    },
    deviceInfoGridRoot: {
        paddingBottom: 0,

    },
    widgetGridContent: {
        paddingLeft: theme.spacing(1)
    }
}));

const DeviceSwitch = (props) => {
    const [newDevice, setNewDevice] = useState({});
    const handleSetTempertaureOnChange = (event) => {
        newDevice.temp = event.target.value;
        setNewDevice(newDevice);
    };
    const classes = useStyles();

    const {isDeviceLoading} = props;

    return (
        <React.Fragment>
            <Typography
                variant="h6"
                align="left"
                color="textPrimary">
                Device Details
            </Typography>
            <Grid
                container
                spacing={0}
                className={classes.widgetGridContent}>

                <Grid item xs={12} sm={4}>
                    <Grid
                        item xs={12}
                        container>
                        <Grid item xs={4}>
                            <Grid container
                                  direction="row"
                                  justify="flex-start"
                                  alignItems="flex-start">
                                <Typography variant="body1" gutterBottom align="center">
                                    <b>Device ID</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container
                                  direction="row"
                                  justify="flex-start"
                                  alignItems="flex-start">
                                <Typography variant="body1" gutterBottom align="center">
                                    <b>{`: `}{isDeviceLoading ? <Spinner size={20}/> : `${props.device}`}</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item xs={4}>
                            <Grid container
                                  direction="row"
                                  justify="flex-start"
                                  alignItems="flex-start">
                                <Typography variant="body1" gutterBottom align="center">
                                    Client
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container
                                  direction="row"
                                  justify="flex-start"
                                  alignItems="flex-start">
                                <Typography variant="body1" gutterBottom align="center">
                                    {`: `}{isDeviceLoading ? <Spinner size={20}/> : `${props.client} `}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item xs={4}>
                            <Grid container
                                  direction="row"
                                  justify="flex-start"
                                  alignItems="flex-start">
                                <Typography variant="body1" gutterBottom align="center">
                                   Temperature
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container
                                  direction="row"
                                  justify="flex-start"
                                  alignItems="flex-start">
                                <Typography variant="body1" gutterBottom align="center">
                                    {`: `}{isDeviceLoading ? <Spinner size={20}/> : `${props.setTemp} `}&#8451;
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={8}
                      container
                      direction="row"
                      alignItems="flex-start">
                    <FormGroup aria-label="enable-device" row>
                        {props.isLoading ?
                            <Spinner size={38}/>
                            :
                            <React.Fragment>
                                <FHInnerTextField
                                    componentClass={classes.deviceIdInput}
                                    inputChangeHandler={handleSetTempertaureOnChange}
                                                  label="Set Temperature"
                                                  type="text"
                                                  variant="outlined"
                                />
                                <Button
                                    className={classes.deleteBtn}
                                    onClick={() => props.handleSetTempertaure(newDevice.temp,props.device)}
                                    variant="contained"
                                    color="primary">
                                    Change Temperature
                                </Button>
                                <Button
                                    className={classes.deleteBtn}
                                    onClick={() => props.handleDeviceDelete(props.device)}
                                    variant="contained"
                                    color="secondary">
                                    Delete Device
                                </Button>

                            </React.Fragment>

                        }
                    </FormGroup>

                </Grid>
            </Grid>

        </React.Fragment>
    )
}

export default DeviceSwitch;