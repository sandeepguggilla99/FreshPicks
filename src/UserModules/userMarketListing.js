import { auth, db, getDocs, collection } from '../../helperClasses/firestoreService.js';
// import { MapPopup } from '../../UserModules/MarketDetails/map.js';
import { filterMarketData } from './userSearchFilter.js';
import { displayCards } from './marketCardRender.js';
const apiKey = "AIzaSyC78YWX15M8UW4ECURpuG-Ro9SVKllrhXY";


// Default filters
const defaultFilters = {
    category: ["1"],
    distance: 30,
    date: "02/11/2023"
};

function formatDate(inputDate) {
    const parts = inputDate.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    } else {
      return 'Invalid Date';
    }
  }
  

let userFilters = { ...defaultFilters };

// Function to update filters based on user input
function updateUserFilters() {

    console.log("*********************We are Hereeeeeeee*********")
    const categorySelect = document.getElementById("filterCategory");
    if (categorySelect.value !== "") {
        console.log("catefory val")
        console.log(categorySelect.value)
        console.log("I am in filterCategory")
        console.log(userFilters.category);
        userFilters.category = [categorySelect.value];
        console.log(userFilters.category);
    }

    const dateInput = document.getElementById("filterDate");
    if (dateInput.value !== "") {
        console.log("*****FKHKJBkjgbvksjbvkjsbv I am in filterDate");
        console.log(dateInput.value);
        userFilters.date = formatDate(dateInput.value);

    }

    const distanceSelect = document.getElementById("filterDistance");
    if (distanceSelect.value !== "") {
        console.log("I am in filterDistance")
        userFilters.distance = parseInt(distanceSelect.value);
    }

    loadGoogleMapsScript();

}

const searchButton = document.getElementById('searchBtn');
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    updateUserFilters();
});

// Function to reset filters to default values
function resetFiltersToDefault() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(function (formGroup) {
        const inputField = formGroup.querySelector('input');
        const selectField = formGroup.querySelector('select');
        
        if (inputField) {
            inputField.value = '';
        }
        
        if (selectField) {
            selectField.selectedIndex = 0;
        }
    });


    // Optionally, trigger the change event to update filters immediately
    updateUserFilters();
}


const clearButton = document.getElementById('clearBtn');
clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    userFilters = { ...defaultFilters };
    resetFiltersToDefault();
});


class Market {
    constructor(marketName, marketCategories, marketDate, marketLocation, marketID) {
        this.marketName = marketName;
        this.marketCategories = marketCategories;
        this.marketDate = marketDate;
        this.marketLocation = marketLocation;
        this.marketID = marketID;
    }
}


const marketDataArray = [];
const collectionName = 'Markets';
let map;

async function getMarketData() {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));

        console.log(querySnapshot);
        querySnapshot.forEach((docSnapshot) => {
            const marketData = docSnapshot.data();
            let marketID = docSnapshot.id;
            console.log("$$$$$$$$$$")
            console.log(marketData)
            let marketName = marketData.marketName;
            let marketCategories = marketData.categories;
            let marketDate = marketData.date;
            let marketLocation = marketData.location;

            console.log(`name: ${marketName}`);
            console.log(`categories: ${marketCategories}`);
            console.log(`Date: ${marketDate}`);
            console.log(`Description: ${marketLocation}`);

            let market = new Market(marketName, marketCategories, marketDate, marketLocation, marketID);
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

                console.log(`Hello Hello ${userFilters.category}`);

                const filter = new filterMarketData(marketDataArray, userLocation, userFilters.category, userFilters.distance, userFilters.date);

                const filteredMarkets = filter.filterMarketsByCategory();

                console.log("this is the filtered array");
                console.log(filteredMarkets);

                displayCards(filteredMarkets);


                displayNearbyLocations(filteredMarkets);

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


function displayNearbyLocations(filteredMarkets) {

    // For example:
    // const nearbyLocations = [
    //     { lat: 49.2827, lng: -123.1207, title: "Burnaby" },
    //     { lat: 49.1666, lng: -123.1336, title: "Richmond" },
    //     { lat: 49.2827, lng: -122.7912, title: "Coquitlam" },
    // ];

    for (let i = 0; i < filteredMarkets.length; i++) {
        console.log((i))
    }

    filteredMarkets.forEach((market) => {

        console.log("HEEYYYYY INSIDE MAPS")
        console.log(market)       

        new google.maps.Marker({
            position:  { lat: market.marketLocation.lat, lng: market.marketLocation.lng },
            map: map,
            title: market.marketName,
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

