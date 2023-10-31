import { getCollectionData } from '/helperClasses/firestoreService.js'

const cardContainer = document.querySelector('.event')
const popSound = document.getElementById('popupSound')

// Mark:- Variables
let marketArr = []
const marketCollectionName = 'Markets'
let userId = "QuvoAepbjRVWyWcPvHaqWMREy712"
let currentOpenInfoWindow = null

// MARK:- Initialize map
function initMap() {
    var lat = 51.508742
    var lng = -0.120850
    var options = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 17,
    }

    let map = new google.maps.Map(document.getElementById('googleMap'), options)

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(userLocation)
            marketArr.forEach((data) => {
                createMarketMarker(data, map)
            })
        }, function () {
            // Handle error or user denial for location
            console.warn("Geolocation failed or permission denied.");
        })

        google.maps.event.addListener(map, 'closeclick', function() {
            if (currentOpenInfoWindow) {
                currentOpenInfoWindow.close();
                infoContent.classList.remove('show')
            }
        })
    } else {

    }
}

function createMarketMarker(data, map) {
    const marker = new google.maps.Marker({
        position: { lat: data.location.lat, lng: data.location.lng },
        map: map,
        title: data.location.name,
    });

    const infoContent = document.createElement('div');
    infoContent.className = 'info-window-content';
    infoContent.innerHTML = `<div><h3>${data.location.name}</h3><button id="direction-${data.id}" class="get-directions">Get Directions</button></div>`

    const infoWindow = new google.maps.InfoWindow({
        content: infoContent
    });

    marker.addListener('click', () => {
        if (currentOpenInfoWindow) {
            currentOpenInfoWindow.close();
        }
        infoWindow.open(map, marker);
        currentOpenInfoWindow = infoWindow
        popSound.play()
        setTimeout(() => addDirectionListener(data.id, data.location.lat, data.location.lng), 0);
        setTimeout(() => infoContent.classList.add('show'), 10);
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

// Mark:- Fetch Market Data
async function getMarketsData() {
    try {
        const data = await getCollectionData(marketCollectionName)
        for (const i of data) {
            console.log(i)
            if (i.userId === userId) {
                marketArr.push(i)
                const card = createCard(i)
                cardContainer.appendChild(card)
            }
            
        }
    } catch (error) {
        console.error("Error:", error)
    }
}

getMarketsData()
initMap()

// MARK:- Create Cards
function createCard(data) {

    const image = data.media.find(item => item.type === "img")

    const card = document.createElement('div')
    card.className = 'card'

    const img = document.createElement('img')
    img.src = image.file
    card.appendChild(img)

    const content = document.createElement('div')
    content.className = 'card-content'
    card.appendChild(content)

    const title = document.createElement('h2')
    title.className = 'card-title'
    title.textContent = data.marketName
    content.appendChild(title)

    const subtitle = document.createElement('p')
    subtitle.className = 'card-subtitle'
    subtitle.textContent = data.subtitle
    content.appendChild(subtitle)

    const date = document.createElement('p')
    date.textContent = `${data.date.date} | ${data.date.time}`
    content.appendChild(date)

    const location = document.createElement('p')
    location.textContent = data.location.name
    content.appendChild(location)

    const rating = document.createElement('p')
    rating.className = 'card-rating'
    for (let i = 0; i < data.rating; i++) {
        rating.textContent += '★'
    }
    content.appendChild(rating)

    const footer = document.createElement('div')
    footer.className = 'card-footer'
    card.appendChild(footer)

    const detailsLink = document.createElement('a')
    detailsLink.href = '#'
    detailsLink.textContent = 'View Details'
    footer.appendChild(detailsLink)

    return card

}
