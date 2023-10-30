import { auth, db, doc, getDoc, getDocs, collection } from '../../helperClasses/firestoreService.js';
import { MapPopup } from '/helperClasses/map.js';
import { filterMarketData } from './userSearchFilter.js';

const apiKey = "AIzaSyC78YWX15M8UW4ECURpuG-Ro9SVKllrhXY";

// Default filters
let filterCategory = "3";
let filterDistance = 10;
// let filterDate = document.getElementById('filterDate').value

// let filterCategory = document.getElementById('filterDate').value
// let filterDistance = Number(document.getElementById('filterDistance').value)
// let filterDate = document.getElementById('filterDate').value

class Market {
    constructor(latitude, longitude, name, categories, date, description) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.categories = categories;
        this.date = date;
        this.description = description;``;
    }
}


const marketDataArray = [];
const closestMarketNames = [];
const collectionName = 'Markets';
let map;

const getMarketData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));

        querySnapshot.forEach((docSnapshot) => {
            const marketData = docSnapshot.data();
            let name = marketData.marketName;
            let categories = marketData.categories;
            let date = marketData.date;
            let description = marketData.description;
            let location = marketData.location;
            let latitude = location.lat;
            let longitude = location.lng;
            let location_name = location.name;

            console.log(`Latitude: ${latitude}`);
            console.log(`Longitude: ${longitude}`);
            console.log(`Market Name: ${name}`);
            console.log(`categories: ${categories}`);
            console.log(`Date: ${date}`);
            console.log(`Description: ${description}`);

            let market = new Market(latitude, longitude, name, categories, date, description);
            marketDataArray.push(market);
        });

    } catch (error) {
        console.error('Error retrieving market data:', error);
    }
};

getMarketData();

window.initMap = function () {
    map = new google.maps.Map(document.getElementById("showMaps"), {
        zoom: 10,
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                map.setCenter(userLocation);

                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                });

                const filter = new filterMarketData(marketDataArray, userLocation, filterCategory, filterDistance, filterDate);

                const filteredMarkets = filter.filterMarketsByCategory();


                console.log("this is the filtered array");
                console.log(filteredMarkets)
                displayNearbyLocations(closestMarketNames);

            },
            (error) => {
                console.error("Error getting user location:", error);
                map.setCenter({ lat: 37.7749, lng: -122.4194 });
            }
        );
    } else {
        map.setCenter({ lat: 37.7749, lng: -122.4194 });
    }
}



function displayNearbyLocations(closestMarketNames) {

    // For example:
    // const nearbyLocations = [
    //     { lat: 49.2827, lng: -123.1207, title: "Burnaby" },
    //     { lat: 49.1666, lng: -123.1336, title: "Richmond" },
    //     { lat: 49.2827, lng: -122.7912, title: "Coquitlam" },
    // ];

    for (let i = 0; i < closestMarketNames.length; i++) {
        console.log((i))
    }

    nearbyLocations.forEach((location) => {
        new google.maps.Marker({
            position: location,
            map: map,
            title: location.title,
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        });
    });

}



function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

loadGoogleMapsScript();

