import React, { DetailedHTMLProps, useRef, useEffect, useContext, useState, memo, ReactNode, ReactElement, CSSProperties, useMemo } from 'react'
import { Loader } from "@googlemaps/js-api-loader";
import L from "leaflet";
import { APPLICATION_CONTEXT } from '../lib';
import { ImSpinner } from 'react-icons/im';
import { useLoadGoogleMaps } from './util';
import { IJob } from '../lib/job';
import { FaMapPin } from 'react-icons/fa';

export const MapView = memo<{ job: IJob, vertical: boolean } & any>((props) => {
    const { job: { coordinates, job_title: title }, vertical = true, zoom = 18, zoomControl = true } = props
    const loading = useLoadGoogleMaps()
    const mapEl = useRef<HTMLDivElement>()

    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [marker, setMarker] = useState<google.maps.Marker>()

    useEffect(() => {
        if (mapEl.current && !loading) {
            const _mapInstance = new google.maps.Map(mapEl.current, {
                center: { lat: coordinates.latitude, lng: coordinates.longitude },
                gestureHandling: 'none',
                zoomControl: zoomControl,
                zoom,
                mapTypeControl: false,
                fullscreenControl: true,
            })
            setMap(_mapInstance)
            setMarker(new google.maps.Marker({
                map: _mapInstance,
                position: { lat: coordinates.latitude, lng: coordinates.longitude },
                animation: google.maps.Animation.DROP,
                title,
            }))
        }
    }, [loading, mapEl])


    useEffect(() => {
        if (coordinates) {
            map?.setCenter({ lat: coordinates.latitude, lng: coordinates.longitude })
            marker?.setPosition({ lat: coordinates.latitude, lng: coordinates.longitude })
        }
    }, [coordinates])

    return (
        loading ?
            <div {...props} className={`${props.className} is-flex is-flex-centered px-6`} style={{ width: '100%', height: '100%', backgroundColor: '#dadada', ...props?.style, }}>
                <progress style={{ height: '0.2rem' }} className="progress is-small my-6 mx-6" max="100">loading</progress>
            </div>
            :
            <div id='mapview' {...props} style={{ ...props?.style, width: '100%', height: '100%', backgroundColor: '#dadada', minHeight: vertical ? '50vh' : '12em', ...props?.style, }} ref={mapEl} />
    )
})