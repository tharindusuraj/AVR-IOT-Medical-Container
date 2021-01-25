import React, { useCallback, useEffect, useState } from 'react';

import Chip from '@material-ui/core/Chip';

import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

const GoogleMapContainer = (props) => {
    const { markerPoints } = props;

    const [markers, setMarkers] = useState([])
    const [centerCoordinate, setCenterCoordinate] = useState({ lat: 0, lng: 0 })
    const [markerLabelState, setMarkerLabelState] = useState({
        showingInfoWindow: false,
        activeMarker: {},
        selectedMarkerTimestamp: {},
    });

    const onMarkerClick = useCallback((timestamp, marker, e) => {
        setMarkerLabelState({
            showingInfoWindow: true,
            activeMarker: marker,
            selectedMarkerTimestamp: new Date(timestamp.name * 1000)
        })
    }, [setMarkerLabelState]);

    const onInfoWindowClose = useCallback(() =>
        setMarkerLabelState({
            showingInfoWindow: false,
            activeMarker: null,
            selectedMarkerTimestamp: null,
        }), []);

    const onMapClicked = useCallback(() => {
        if (markerLabelState.showingInfoWindow) {
            setMarkerLabelState({
                showingInfoWindow: false,
                activeMarker: null,
                selectedMarkerTimestamp: null
            })
        }
    }, [setMarkerLabelState, markerLabelState.showingInfoWindow]);

    useEffect(() => {
        if (Object.keys(markerPoints).length !== 0 && markerPoints.constructor === Object) {
            const newMarkers = [];
            for (const time in markerPoints) {
                const latlngStr = markerPoints[time].Loc.split(",");

                const latlng = {
                    lat: latlngStr[0],
                    lng: latlngStr[1]
                }
                newMarkers.push(
                    <Marker
                        key={time}
                        id={time}
                        position={latlng}
                        onClick={onMarkerClick}
                        name={time} />

                )
            }
            setMarkers(newMarkers);

            const centerLatLngStr = markerPoints[Object.keys(markerPoints)[0]].Loc.split(",");
            const centerLatLng = {
                lat: centerLatLngStr[0],
                lng: centerLatLngStr[1]
            }
            setCenterCoordinate(centerLatLng);
        } else {
            setMarkers([]);
        }
    }, [markerPoints, onMarkerClick])

    const dateTime = markerLabelState.selectedMarkerTimestamp;
    return (
        <Map
            google={props.google}
            zoom={10}
            style={{ width: '100%', height: '100%', position: 'relative' }}
            containerStyle={{ width: '100%', height: '100%', position: 'relative' }}
            initialCenter={centerCoordinate}
            center={centerCoordinate}
            onClick={onMapClicked}
        >
            {markers}
            <InfoWindow
                marker={markerLabelState.activeMarker}
                onClose={onInfoWindowClose}
                visible={markerLabelState.showingInfoWindow}>
                <Chip
                    variant="outlined"
                    size="small"
                    label={`${dateTime}`}
                    color="primary" />
            </InfoWindow>
        </Map>
    );

};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(GoogleMapContainer);