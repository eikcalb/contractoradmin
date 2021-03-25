import React, { DetailedHTMLProps, useRef, useEffect, useContext } from 'react'
import { Loader } from "@googlemaps/js-api-loader";
import L from "leaflet";
import { APPLICATION_CONTEXT } from '../lib';

export const MapView = (props) => {
    const ctx = useContext(APPLICATION_CONTEXT)

    // const map = useRef(L.map('mapview'))
    const loader = new Loader({
        apiKey: ctx.config.Google.mapKey,
        version: "weekly",
    })

    const { job: { coordinates } } = props

    useEffect(() => {
        if (coordinates) {
            // map.current?.setView({ lat: coordinates.latitude, lng: coordinates.longitude })
        }
    }, [coordinates])

    return (
        <div id='mapview' style={{ width: '100%', height: '100%', backgroundColor: '#dadada' }} ref={(ref) => {
            if (ref) {
                // map.current = L.map(ref, {
                //     zoomControl: false,
                //     keyboard: false,
                // })
            }
        }} {...props}>

        </div>
    )
}