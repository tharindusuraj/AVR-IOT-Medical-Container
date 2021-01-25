'use strict';

const { exec } = require("child_process");

const functions = require('firebase-functions');
const admin = require("firebase-admin");

var config = require("./config.json");

const pageLengthInMonths = 1;

// MQTT constants
const iot = require('@google-cloud/iot');
const cloudRegion = 'us-central1';
const projectId = 'medical-cooler-box';
const registryId = 'AVR-IOT';
const version = 0;
// ------------------------------------------------------------

admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccount),
    databaseURL: config.databaseUrl
});

const cors = require('cors')({
    origin: true,
});

let db = admin.database();

/**
 *  Fetch device logs from the database
 */
const getDeviceLogs = async (deviceId, start, end) => {


    let deviceLogs = db.ref(`avr-iot/datalogs/${deviceId}`);
    return await deviceLogs.orderByKey().startAt(start.toString()).endAt(end.toString()).once("value");
};

/**
 *  Verify the auth token sent in the request header `x-auth`
 */
const verifyAuthToken = token => {
    return admin.auth().verifyIdToken(token);
};

/**
 *  Get the time range depending on  the provided time range input
 *  in  the /dashboard api call
 */
const getTimeRange = (start, end) => {
    let startTime, endTime;
    if (!start && !end) {
        startTime = new Date(); // get current time
        endTime = new Date();
        startTime.setMonth(startTime.getMonth() - pageLengthInMonths);
    }
    else if (!start && end) {
        endTime = new Date(end * 1000);
        startTime = new Date(end * 1000);
        startTime.setMonth(startTime.getMonth() - pageLengthInMonths); // set the start time with maximum allowed gap
    }
    else if (start && !end) {
        startTime = new Date(start * 1000);
        endTime = new Date(start * 1000);
        endTime.setMonth(endTime.getMonth() + pageLengthInMonths); // set the end time with maximum allowed gap
    }
    else {
        startTime = new Date(start * 1000);
        endTime = new Date(end * 1000);
        let difference = endTime.getTime() - startTime.getTime();
        let differenceInDays = difference / (1000 * 3600 * 24);
        if (differenceInDays < 0 || differenceInDays > 30 * pageLengthInMonths) {
            endTime = new Date(startTime.getTime());
            endTime.setMonth(endTime.getMonth() + pageLengthInMonths);
        }
    }

    return {
        start: Math.floor(startTime.getTime() / 1000),
        end: Math.floor(endTime.getTime() / 1000)
    }
};

/**
 *  send updated device temperature
 */
const sendTemperatureUpdated = async (reqest) => {
    const deviceId = 'd'.concat(reqest.body.deviceId);
    const data = reqest.body.setTemp;

    const iotClient = new iot.v1.DeviceManagerClient({
    });

    async function modifyCloudToDeviceConfig() {
        // Construct request
        const formattedName = iotClient.devicePath(
            projectId,
            cloudRegion,
            registryId,
            deviceId
        );

        const binaryData = Buffer.from(data).toString('base64');
        const request = {
            name: formattedName,
            versionToUpdate: version,
            binaryData: binaryData,
        };

        const [response] = await iotClient.modifyCloudToDeviceConfig(request);
        console.log('Success:', response);
    }

    modifyCloudToDeviceConfig();
};
/**
 *    Title       : Get Dashboard API
 *    Url         : {Host}/dashboard
 *    Description : Fetches devices logs for the dashboard. Response format is something like
 *                  {
                        "devices": {
                            "testTk": {
                                "client": "testClientName",
                                "setTemp": "23"
                            }
                        },
                        "info": {
                            "deviceId": "testTk",
                            "client": "testClientName",
                            "setTemp" :"23",
                            "timeRange": {
                                "start": 1607445701,
                                "end": 1610124101
                            },
                            "logs": null
                        }

 */
exports.dashboard = functions.https.onRequest(async (req, res) => {

    if (req.method === "OPTIONS") {
        return cors(req, res, () => {
            res.status(200).send({});
        });
    }

    if (req.method !== "GET" && req.method !== "OPTIONS") {
        return cors(req, res, () => {
            res.status(400).send({ error: 'Please send a GET request' })
        });
    }

    let start = req.query.start ? parseInt(req.query.start, 10) : undefined;
    let end = req.query.end ? parseInt(req.query.end, 10) : undefined;

    let ref = db.ref("avr-iot/devices");

    return ref.once("value", snapshot => {
        let devices = snapshot.val();

        if (devices === null)
            return cors(req, res, () => {
                res.status(200).send({devices: [], info: {}});
            });

        let deviceId = req.query.deviceId || devices && Object.keys(devices)[0];
        let timeRange = getTimeRange(start, end);

        return getDeviceLogs(deviceId, timeRange.start, timeRange.end).then(logs => {
            let resp = {
                devices: devices,
                info: {
                    deviceId: deviceId,
                    setTemp: devices[deviceId] && devices[deviceId].setTemp,
                    client: devices[deviceId] && devices[deviceId].client,
                    timeRange: timeRange,
                    logs: logs
                }
            }
            return cors(req, res, () => {
                res.status(200).send(resp);
            });
        }).catch(error => {
            return cors(req, res, () => {
                res.status(500).send(error);
            });
        });
    });
});

/**
 *    Title       : Toggle Device Status  API
 *    Url         : {Host}/toggleDeviceStatus
 *    Description : If you make the call to the  api with a new device id -> it will create a new device record
 *                  If you make the call to the api with an existing device id -> it will update the  device record.
 *                  Main purposes are creating new device records and updating set Temperature.
 */
exports.toggleDeviceStatus = functions.https.onRequest((req, res) => {
    let token = req.headers['x-auth'];
    if (req.method === "OPTIONS") {
        return cors(req, res, () => {
            res.status(200).send({});
        });
    }
    //Sending temperature updates to the device
    sendTemperatureUpdated(req);

    verifyAuthToken(token).then(result => {
        if (req.method !== "POST" && req.method !== "OPTIONS") {
            return cors(req, res, () => {
                res.status(400).send({ error: 'Please send a POST request' });
            });
        }

        let deviceId = req.body.deviceId;
        let client = req.body.client;
        let setTemp = req.body.setTemp;

        let deviceRecord = {}

        if (!deviceId) {
            return cors(req, res, () => {
                res.status(400).send({ error: "Device id shouldn't be empty" });
            });
        }

        let refS = db.ref("avr-iot/devices");
        refS.child(deviceId).once("value", function (snapshot) {
            if (snapshot.val() && client) {
                refS.off();
                return cors(req, res, () => {
                    res.status(400).send({ error: "Device id already exists" });
                });
            }
            refS.off();

            if (client) {
                deviceRecord.client = client;
            }if (setTemp) {
                deviceRecord.setTemp = setTemp;
            }

            if (Object.keys(deviceRecord).length > 0) {
                let ref = db.ref("avr-iot/devices");
                ref.child(deviceId).update(deviceRecord);
                ref.off();
                return cors(req, res, () => {
                    res.status(200).send({ message: "Success" });
                });
            }

            return cors(req, res, () => {
                res.status(400).send({ message: "Nothing Updated" });
            });
        });

        return;


    }).catch(error => {
        return cors(req, res, () => {
            res.status(403).send({ error: error.message });
        });
    });
});

/**
 *    Title       : Delete Device  API
 *    Url         : {Host}/deleteDevice
 *    Description : Deletes a device record
 */
exports.deleteDevice = functions.https.onRequest((req, res) => {
    if (req.method === "OPTIONS") {
        return cors(req, res, () => {
            res.status(200).send({});
        });
    }
    let token = req.headers['x-auth'];
    verifyAuthToken(token).then(result => {
        if (req.method !== "DELETE" && req.method !== "OPTIONS") {
            return cors(req, res, () => {
                res.status(400).send({ error: 'Please send a DELETE request' });
            });
        }

        const deviceId = req.query.deviceId;

        // block if deviceId is empty or not licensed
        if (!deviceId) {
            return cors(req, res, () => {
                res.status(400).send({ error: 'Please send a valid device ID' });
            });
        }

        let ref = db.ref("avr-iot/devices");
        ref.child(deviceId).remove();
        ref.off();
        return cors(req, res, () => {
            res.status(204).send({ message: 'Successfully deleted the device!' });
        });
    }).catch(error => {
        return cors(req, res, () => {
            res.status(403).send({ error: error.message });
        });
    });
});