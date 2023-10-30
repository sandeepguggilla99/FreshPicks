import { MAP_KEY } from '/helperClasses/constants.js'

let map;
let marker;

export function initMap(element) {
  map = new google.maps.Map(document.getElementById(element), {
    center: { lat: 0, lng: 0 },
    zoom: 15
  });

  const input = document.getElementById('location');
  const searchBox = new google.maps.places.SearchBox(input);

  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;
    const place = places[0];

    marker.setPosition(place.geometry.location);

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    console.log(`Selected location: Lat ${lat}, Lng ${lng}`);
  });

  marker = new google.maps.Marker({
    map,
    draggable: true,
  });

  marker.addListener('dragend', () => {
    const position = marker.getPosition();
    const lat = position.lat();
    const lng = position.lng();
    console.log(`Selected location: Lat ${lat}, Lng ${lng}`);
  });
}


export class MapPopup {
    constructor() {
        this.mapContainer = document.getElementById('map-container');
        this.closeMapButton = document.getElementById('close-map');
        this.map = null;
        this.marker = null;
    }

    initializeMap() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 0, lng: 0 },
            zoom: 15,
        });

        this.marker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            position: { lat: 0, lng: 0 },
        });

        this.marker.addListener('dragend', () => {
            const position = this.marker.getPosition();
            const lat = position.lat();
            const lng = position.lng();
            console.log(`Selected location: Lat ${lat}, Lng ${lng}`);
        });
    }

    show() {
        this.mapContainer.style.display = 'block';
        this.initializeMap();
        this.closeMapButton.addEventListener('click', () => this.close());
    }

    close() {
        this.mapContainer.style.display = 'none';
        this.closeMapButton.removeEventListener('click', () => this.close());
    }
}