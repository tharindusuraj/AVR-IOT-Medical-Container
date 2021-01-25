import React, {useState} from "react";

import {makeStyles} from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {Grid, Typography} from "@material-ui/core";

import FHInnerTextField from "../components/UI/FHInnerTextField/FHInnerTextField";
import {useDispatch} from "react-redux";
import {addNewDevice} from "../store/actions/index";

const useStyle = makeStyles(theme => ({
    deviceIdInput: {
        background: 'transparent',
        width: '100%',
        marginBottom: theme.spacing(1),

    },
    margin: {
        marginLeft: theme.spacing(0.125),
    },
    expiryInput: {
        width: '100%'
    }
}));

const RegisterDevice = () => {
    const [newDevice, setNewDevice] = useState({});

    const dispatch = useDispatch();

    const classes = useStyle();

    const handleAddDeviceClick = (device) => {
        if (device === {}) {
            alert("Device shouldn't be empty")
        }
        dispatch(addNewDevice(device))
    };

    const handleDeviceIdOnChange = (event) => {
        newDevice.id = event.target.value;
        setNewDevice(newDevice);
    };

    const handleDeviceClientOnChange = (event) => {
        newDevice.client = event.target.value;
        setNewDevice(newDevice);
    };

    const handleDeviceTemperatureOnChange = (event) => {
        newDevice.setTemp =  event.target.value;
        setNewDevice(newDevice);
    };

    return (
        <Grid container spacing={3} className={classes.margin}>
            <Grid item xs={12}>
                <Typography
                    variant="h6"
                    align="left"
                    paddingLeft='8px'
                    color="textPrimary">
                    Add New Device
                </Typography>
            </Grid>
            <Grid item xs={7}>
                <FHInnerTextField componentClass={classes.deviceIdInput}
                                  inputChangeHandler={handleDeviceIdOnChange}
                                  label="Device ID"
                                  type="text"
                                  variant="outlined"
                />
                <FHInnerTextField componentClass={classes.deviceIdInput}
                                  inputChangeHandler={handleDeviceClientOnChange}
                                  label="Client Name"
                                  type="text"
                                  variant="outlined"
                />
                <FHInnerTextField componentClass={classes.deviceIdInput}
                                  inputChangeHandler={handleDeviceTemperatureOnChange}
                                  label="Temperature"
                                  type="text"
                                  variant="outlined"
                />

            </Grid>
            <Grid
                item xs={5}
                container
                direction="column-reverse"
                justify="center"
                alignItems="center">
                <Fab
                    color="primary" aria-label="add"
                    onClick={() => handleAddDeviceClick(newDevice)}
                    disabled={newDevice.length === 0}>
                    <AddIcon/>
                </Fab>
            </Grid>
        </Grid>
    );
};

export default RegisterDevice;