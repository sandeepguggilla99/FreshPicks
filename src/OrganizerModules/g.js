
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 5
    };
    // var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    this.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);

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

