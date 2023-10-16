import { MAP_KEY } from '/helperClasses/constants.js'

let map
let marker

export function initMap(element) {

    var script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&libraries=places`
    script.defer = true

    script.onload = function () {
        map = new google.maps.Map(document.getElementById(element), {
            center: { lat: 0, lng: 0 }, // Set the initial map center
            zoom: 15, // Adjust the zoom level as needed
        })

        const input = document.getElementById('location')
        const searchBox = new google.maps.places.SearchBox(input)

        map.addListener('bounds_changed', () => {
            searchBox.setBounds(map.getBounds())
        })

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces()
            if (places.length === 0) return
            const place = places[0]

            // Update the marker's position
            marker.setPosition(place.geometry.location)

            // You can also get the latitude and longitude from place.geometry.location
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            console.log(`Selected location: Lat ${lat}, Lng ${lng}`)
        })

        // Create a draggable marker
        marker = new google.maps.Marker({
            map,
            draggable: true,
        })

        // Listen to marker drag events
        marker.addListener('dragend', () => {
            const position = marker.getPosition()
            const lat = position.lat()
            const lng = position.lng()
            console.log(`Selected location: Lat ${lat}, Lng ${lng}`)
        })

    }

    document.head.appendChild(script)
}

