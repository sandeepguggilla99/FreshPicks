import { auth, db, getDocs, collection } from '../../helperClasses/firestoreService.js';
// import { MapPopup } from '../../UserModules/MarketDetails/map.js';
import { filterMarketData } from './userSearchFilter.js';
import { displayCards } from './marketCardRender.js';
import { moveSliderValue, formatDate } from '../../helperClasses/FilterUtils.js';
const apiKey = "AIzaSyC78YWX15M8UW4ECURpuG-Ro9SVKllrhXY";
let currentOpenInfoWindow = null
const popSound = document.getElementById('popupSound')


function getCurrentDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();

    console.log("todays date");
    console.log(`${day}/${month}/${year}`);
    return `${day}/${month}/${year}`;
}

// Default filters
const defaultFilters = {
    category: [],
    distance: 5,
    date: ""
};

let selectedDate = null;

  function applyStyleToSelectedOption(optionId) {
    const dateOptions = document.getElementById('dateOptions');
    const options = dateOptions.querySelectorAll('.form-check-label');

    options.forEach(option => {
      option.style.backgroundColor = '#f0f0f0';  
      option.style.color = '';  
    });

    const selectedOption = document.getElementById(optionId);

    if (selectedOption) {
      selectedOption.style.backgroundColor = '#0D6EFD';
      selectedOption.style.color = 'white';
    }
  }


  function setupDateOptions() {
    const dateOptions = document.getElementById('dateOptions');
    const n = 4; // Number of days to display

    for (let i = 0; i < n; i++) {
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = formatDate(date);

      const dateLabel = document.createElement('label');
      dateLabel.classList.add('form-check-label');
      dateLabel.id = `dateOption${i + 1}`;
      dateLabel.innerHTML = `
        <input class="form-check-input" type="radio" name="date" value="${formattedDate}">
        ${formattedDate}
      `;

      dateOptions.appendChild(dateLabel);

      dateLabel.addEventListener('click', () => {
        applyStyleToSelectedOption(dateLabel.id);
        selectedDate = formattedDate; 
      });
    }
  }

  // Call the setupDateOptions function to set up the date options
  setupDateOptions();

const selectedCategories = [];
const distanceSelect =  moveSliderValue();


function updateSelectedCategories(categoryCheckboxInput, categoryInputValue) {
    if (categoryCheckboxInput.checked) {
        selectedCategories.push(categoryInputValue);
    } else {
        const index = selectedCategories.indexOf(categoryInputValue);
        if (index !== -1) {
            selectedCategories.splice(index, 1);
        }
    }

    console.log("SELECTED CATES");
    console.log(selectedCategories)
}



async function populateMarketCategories(CategoryList) {
    const categoryBox = document.getElementById("categoryBox");

    // Clear any existing checkboxes
    categoryBox.innerHTML = '';

    const categoryLabelCategory = document.createElement("label");
    categoryLabelCategory.setAttribute("for", "filterCategory");
    categoryLabelCategory.className = "form-label";
    categoryLabelCategory.textContent = "Category:";

    categoryBox.appendChild(categoryLabelCategory);

    CategoryList.forEach((category) => {
        // Create a new checkbox element
        const categoryCheckboxDiv = document.createElement("div");
        categoryCheckboxDiv.className = "form-check form-check-inline custom-checkbox";

        const categoryCheckboxInput = document.createElement("input");
        categoryCheckboxInput.className = "form-check-input";
        categoryCheckboxInput.type = "checkbox";
        categoryCheckboxInput.id = category.name;
        categoryCheckboxInput.value = category.id;

        const categoryCheckboxLabel = document.createElement("label");
        categoryCheckboxLabel.className = "form-check-label";
        categoryCheckboxLabel.setAttribute("for", category.name);
        categoryCheckboxLabel.textContent = category.name;

        console.log("WHAT IS HAPPENINNGGG")

        categoryCheckboxInput.addEventListener('change', () => {
            updateSelectedCategories(categoryCheckboxInput, categoryCheckboxInput.value);
        });

        // Append the checkbox elements to the categoryBox
        categoryCheckboxDiv.appendChild(categoryCheckboxInput);
        categoryCheckboxDiv.appendChild(categoryCheckboxLabel);
        categoryBox.appendChild(categoryCheckboxDiv);
    });
}


let userFilters = { ...defaultFilters };

function updateUserFilters() {

    console.log("IAM IN UPDATE FILTERS")
    if (selectedCategories.length != 0) {
        userFilters.category = selectedCategories.slice();;
        console.log(userFilters.category);
    }



    
    if (distanceSelect.value !== "") {
        console.log("I am in filterDistance")
        userFilters.distance = parseInt(distanceSelect.value);
    }

    if (selectedDate != "") {
        console.log("***FKHKJBkjgbvksjbvkjsbv I am in filterDate");
        console.log(selectedDate);
        userFilters.date = selectedDate

    }

    loadGoogleMapsScript();

}

const applyFiltersButton = document.getElementById('applyFilters');
applyFiltersButton.addEventListener('click', function (event) {
    event.preventDefault();
    updateUserFilters();
});

// Add an event listener to the "Clear Filters" button
document.getElementById("clearFiltersButton").addEventListener("click", function() {
    // Clear checkbox filters
    var categoryCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    categoryCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });

    // Reset the range input for distance
    document.getElementById("filterDistance").value = 5;
    document.getElementById("sliderValue").textContent = "5";

    // Clear date options (You'll need to add this functionality)
    var dateOptions = document.getElementById("dateOptions");
    selectedDate = null;
    dateOptions.innerHTML = ''; 
    setupDateOptions();

    
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
    constructor(marketName, marketCategories, marketDate, marketLocation, marketID, marketImage) {
        this.marketName = marketName;
        this.marketCategories = marketCategories;
        this.marketDate = marketDate;
        this.marketLocation = marketLocation;
        this.marketID = marketID;
        this.marketImage = marketImage;
    }
}


const marketDataArray = [];
const collectionMarket = 'Markets';
const collectionCategories = 'Categories';
let map;

async function getMarketData() {
    try {
        const querySnapshot = await getDocs(collection(db, collectionMarket));

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
            const image = marketData.media.find(item => item.type === "img")
            let marketImage = image

            console.log("Is this imageeeee??")
            console.log(marketImage)

            console.log(`name: ${marketName}`);
            console.log(`categories: ${marketCategories}`);
            console.log(`Date: ${marketDate}`);
            console.log(`Location: ${marketLocation}`);

            let market = new Market(marketName, marketCategories, marketDate, marketLocation, marketID, marketImage);
            marketDataArray.push(market);
        });

    } catch (error) {
        console.error('Error retrieving market data:', error);
    }
};

async function getCategoriesData() {
    try {
        const queryCategoriesSnapshot = await getDocs(collection(db, collectionCategories));

        console.log(queryCategoriesSnapshot);
        queryCategoriesSnapshot.forEach((docSnapshot) => {
            const CategoriesData = docSnapshot.data();
            console.log(CategoriesData)
            let CategoryList = CategoriesData.Category;
            
            console.log(`categories: ${CategoryList}`);

            populateMarketCategories(CategoryList);
        });

    } catch (error) {
        console.error('Error retrieving market data:', error);
    }
};

getMarketData();
getCategoriesData();

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


                const filter = new filterMarketData(marketDataArray, userLocation, userFilters.category, userFilters.distance, userFilters.date);
                const filteredMarkets = filter.filterMarketsByCategory();

                
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
    filteredMarkets.forEach((market) => {
        let marker = new google.maps.Marker({
            position: { lat: market.marketLocation.lat, lng: market.marketLocation.lng },
            map: map,
            title: market.marketName,
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        });

    const infoContent = document.createElement('div');
    infoContent.className = 'info-window-content';
    infoContent.style.maxWidth = '300px'; // Set a max-width for the content
    console.log(market, market.marketImage.file)

    infoContent.innerHTML = `
      <div style="position: relative;">
        <img src="${market.marketImage.file}" alt="${market.marketLocation.name}" style="width: 300px; height: 150px; border-top-left-radius: 8px; border-top-right-radius: 8px;"/>
      </div>
      <div style="background: white; padding: 10px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        <div style="font-weight: bold; margin-bottom: 5px;">${market.marketName}</div>
        <span style="color: green;">${market.marketLocation.name}</span>
        <div style="margin-bottom: 5px;">
          <span style="color: #FFD700;">★</span> 4
        </div>
        <div style="display: flex; justify-content: space-between;">
          <button id="direction-${market.id}" class="get-directions" style="background-color: #E0E0E0; padding: 8px; border-radius: 4px; border: none; cursor: pointer;">
          <img src="../../assets/direction.png" alt="Share" style="width: 30px; height: 30px;">
          </button>
          <button id="share-${market.id}" class="share-location" style= "background-color: #E0E0E0; "padding: 8px; border-radius: 4px; border: none; cursor: pointer;">
          <img src="../../assets/share.png" alt="Share" style="width: 25px; height: 25px;">
          </button>
        </div>
      </div>`;

        const infoWindow = new google.maps.InfoWindow({
            content: infoContent
        });

        marker.addListener('click', () => {
            if (currentOpenInfoWindow) {
                currentOpenInfoWindow.close();
            }
            infoWindow.open(map, marker);
            currentOpenInfoWindow = infoWindow;
            popSound.play();
            setTimeout(() => addDirectionListener(market.marketID, market.marketLocation.lat, market.marketLocation.lng), 0);
            setTimeout(() => infoContent.classList.add('show'), 10);
        });
    });
}

function addDirectionListener(id, lat, lng) {
    const button = document.getElementById(`direction-${id}`);
    if (button) {
        button.addEventListener('click', () => {
            getDirections(lat, lng);
        });
    }
}

function getDirections(lat, lng) {
    const directionUrl = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${lat},${lng}`;
    window.open(directionUrl, '_blank');
}



function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

loadGoogleMapsScript();