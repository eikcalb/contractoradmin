// Check geolocation exists
export function isGeoLocationSupported() {
    return 'geolocation' in navigator
}

export function getCurrentLocation(): Promise<Position> {
    return new Promise((res, rej) => {
        if (!isGeoLocationSupported()) {
            throw new Error('Geolocation is not supported! Cannot find current location!')
        }

        navigator.geolocation.getCurrentPosition(res, rej, {
            enableHighAccuracy: true,
            maximumAge: 1000
        })
    })
}