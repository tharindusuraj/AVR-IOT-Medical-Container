import React, {useState, useEffect, useCallback} from "react";

import {useSelector, useDispatch} from 'react-redux';

import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {DateTimePicker} from "@material-ui/pickers";

import Map from "../components/UI/GoogleMap/GoogleMap";
import LineChart from '../components/UI/Charts/LineChart';

import {loadDeviceInfoWithTime, toggleDeviceStatus} from "../store/actions/index";
import DeviceSwitch from "../components/UI/DeviceSwitch/DeviceSwitch";
import Spinner from '../components/UI/Spinner/Spinner';
import {deleteDevice} from "../store/actions/dashboard";

const useStyles = makeStyles((theme) => ({
    page: {
        flexGrow: 1,
        height: '100%',
    },
    paper: {
        paddingTop: theme.spacing(1),
        padding: theme.spacing(2),
        textAlign: "center",
        height: '100%'
    },
    timeRange: {
        padding: theme.spacing(0.125),
    }, filterRange: {
        paddingBottom: theme.spacing(1),
    },
    enableDevice: {
        justifyContent: 'center'
    },
    filterButtonGridRoot: {
        paddingBottom: theme.spacing(0),
        width: "135px",
        alignSelf: 'center',
        height: '8vh',
    },
    filterText: {
        justifyContent: 'center',
        fontWeight: '500',
        color: "#e81001",
        // color: "#f50057",
        fontSize: "large"
    },
}));


const calcDateGap = (d1, d2) => {
    let diffTime = Math.abs(d1 - d2);
    let diff = Math.ceil(diffTime / (1000 * 60 * 60));
    return diff;
};

/**
 * This function clusters epoch timestamps
 * @param {*} gpsCoordinates
 */
const clusterTimestamps = (gpsCoordinates) => {
    let clusterObj = {};
    let currDateEpoch;
    let currDateLocale;
    let tempDataset = [];
    let date;

    for (let epoch in gpsCoordinates) {
        let epochDate = new Date(epoch*1000);
        date = epochDate.toLocaleString();

        let tempDataPoint = {
            date: date,
            count: gpsCoordinates[epoch].Temp
        }
        tempDataset.push(tempDataPoint);

        if (clusterObj[date] !== undefined && (currDateLocale === date)) {
            clusterObj[date] = calcDateGap(epochDate, currDateEpoch);
            tempDataset[date] = calcDateGap(epochDate, currDateEpoch);
        } else {
            clusterObj[date] = 0;
            tempDataset[date] = 0;
            currDateEpoch = epochDate;
            currDateLocale = date;
        }
    }
    let totalHours = 0;

    return [ tempDataset,totalHours ];
}

const ManageDevices = (props) => {

    const classes = useStyles();

    const selectedDevice = useSelector(state => state.selectedDevice);
    const isLoading = useSelector(state => state.loading);
    const isDeviceLoading = useSelector(state => state.loadingDeviceInfo);
    const {deviceId, client, status, timeRange, logs, deviceExpiry , setTemp} = selectedDevice;

    const [endDateTime, setEndDateTimeChange] = useState(new Date());
    const [startDateTime, setStartDateTimeChange] = useState(new Date());
    const [gpsCoordinates, setGPSCoordinates] = useState({});
    const [deviceIsLoading, setDeviceIsLoading] = useState(false);
    const [clusteredEpochs, setClusteredEpochs] = useState([]);
    const [tempDataset, setTempDataset] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [totalHoursTemp, setTotalHoursTemp] = useState(0);
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        if (timeRange) {
            setStartDateTimeChange(new Date(timeRange.start*1000));
            setEndDateTimeChange(new Date(timeRange.end*1000));
        }
        setIsFiltering(false);
    }, [timeRange]);

    useEffect(() => {
        if (logs) {
            setGPSCoordinates(logs);
        } else {
            setGPSCoordinates({});
        }
    }, [logs]);

    useEffect(() => {
        if (gpsCoordinates) {
            let [tempDataset, totalHours] = clusterTimestamps(gpsCoordinates);
            setTempDataset(tempDataset);
            setTotalHoursTemp(totalHours);

        }
    }, [gpsCoordinates])

    const dispatch = useDispatch()

    const handleFilterClicked = useCallback(() => {
        setIsFiltering(true);

        dispatch(loadDeviceInfoWithTime(
            deviceId,
            startDateTime.getTime()/1000 ,
            endDateTime.getTime()/1000
        ));
    }, [deviceId, startDateTime, endDateTime, dispatch])

    const handleDeviceDelete = (deviceId) => {
        setDeviceIsLoading(true);
        if (window.confirm(`Do you really want to delete device : ${deviceId}`)) {
            dispatch(deleteDevice(deviceId, () => {
                setDeviceIsLoading(false);
            }));
        } else {
            setDeviceIsLoading(false);
        }
    };

const handleSetTempertaure = (setTemp, deviceId) => {
    setDeviceIsLoading(true);
    if (window.confirm(`Do you really want to change the Temperature for device : ${deviceId}`)) {
        dispatch(toggleDeviceStatus({
            'deviceId': deviceId,
            'setTemp': setTemp
        }, () => {
            setDeviceIsLoading(false);
        }));
    } else {
        setDeviceIsLoading(false);
    }
}

    if (isLoading) {
        return (<Spinner/>)
    } else {
        return (
            <div className={classes.page}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Paper
                            elevation={5}
                            className={classes.paper}>
                            <DeviceSwitch
                                handleDeviceDelete={handleDeviceDelete}
                                status={status || false}
                                isLoading={deviceIsLoading}
                                handleSetTempertaure={handleSetTempertaure}
                                client={client}
                                setTemp={setTemp}
                                device={deviceId}
                                isDeviceLoading={isDeviceLoading}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            elevation={5}
                            className={classes.paper}>
                            <Grid
                                container spacing={0}
                                className={classes.timeRange}>
                                <Grid container
                                      direction="row"
                                      justify="flex-start"
                                      alignItems="flex-start"
                                >
                                    <Typography variant="h6" gutterBottom align="left" className={classes.filterRange}>
                                        Device Usage Period
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Grid container
                                          direction="row"
                                          justify="flex-start"
                                          alignItems="center">
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Grid container
                                          direction="row"
                                          justify="flex-start"
                                          alignItems="center">
                                        <DateTimePicker
                                            variant="inline"
                                            ampm={true}
                                            label="Start date & time"
                                            value={startDateTime}
                                            onChange={setStartDateTimeChange}
                                            onError={console.log}
                                            format="dd/MM/yyyy HH:mm"
                                            inputVariant="outlined"
                                        />
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Grid container
                                          direction="row"
                                          justify="flex-start"
                                          alignItems="center">
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Grid container
                                          direction="row"
                                          justify="flex-start"
                                          alignItems="center">
                                        <DateTimePicker
                                            variant="inline"
                                            ampm={true}
                                            label="End date & time"
                                            value={endDateTime}
                                            onChange={setEndDateTimeChange}
                                            onError={console.log}
                                            format="dd/MM/yyyy HH:mm"
                                            inputVariant="outlined"
                                        />

                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Grid container
                                          direction="row"
                                          justify="flex-start"
                                          alignItems="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFilterClicked}
                                            disabled={isFiltering}
                                            classes={{
                                                root: classes.filterButtonGridRoot
                                            }}>
                                            {isFiltering ?
                                                <Spinner size={20}/>
                                                :
                                                'Filter'}
                                        </Button>

                                    </Grid>
                                </Grid>
                            </Grid>


                        </Paper>
                    </Grid>


                    <Grid item xs={12}>
                        <Paper
                            elevation={5}
                            className={classes.paper}>
                            <Typography
                                variant="h6"
                                align="left"
                                color="textPrimary"
                                gutterBottom>
                                Device Locations
                            </Typography>
                            <Typography variant="body1" gutterBottom align="center"
                                        className={classes.filterText}>
                                Showing {Object.keys(gpsCoordinates).length} Data Points and {totalHours} Hours
                            </Typography>
                            <Grid
                                container
                                style={{height: '50vh'}}>
                                <Map markerPoints={gpsCoordinates}/>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            elevation={5}
                            className={classes.paper}>
                            <Typography
                                variant="h6"
                                align="left"
                                color="textPrimary"
                                gutterBottom>
                                Temperature Details
                            </Typography>
                            <LineChart
                                yLabel={'Temperature'}
                                title={`Temperature inside the Container`}
                                lineSeriesFields={{name: 'Date', x: 'date', y: 'count'}}
                                chartData={tempDataset}/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
};

export default ManageDevices;