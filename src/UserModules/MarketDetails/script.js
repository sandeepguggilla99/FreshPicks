// script.js


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import{getAuth} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { MapPopup } from '../../UserModules/MarketDetails/map.js';
const apiKey = 'AIzaSyC78YWX15M8UW4ECURpuG-Ro9SVKllrhXY'


// import { doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDkJbt9ewyYvPLb5LJDpDAFIaIvva9iaec",
  authDomain: "freshpicks-da3ef.firebaseapp.com",
  projectId: "freshpicks-da3ef",
  storageBucket: "freshpicks-da3ef.appspot.com",
  messagingSenderId: "610098249496",
  appId: "1:610098249496:web:0475aa3b2c11a9f049686d",
  measurementId: "G-82WSX2M2V3"
};


const app = initializeApp(firebaseConfig);


const auth =   getAuth(app);
const db = getFirestore(app);
const collectionName = 'Markets';
// const documentId = '2UXfZ9IkIEusisHo9Ait';
let map;


const currentURL = window.location.href;


// Extract the documentId from the URL
const params = new URLSearchParams(new URL(currentURL).search);
const documentId = params.get("documentId");




// const marketData = {
//     marketName: "First Market",
//     description: "This is our First Market",
//     faq: [
//         { question: "First", answer: "second" },
//         { question: "First", answer: "second" },
//     ],
//     media: [
//         { file: "https://firebasestorage.googleapis.com/v0/b/freshpicks-da3ef.appspot.com/o/image%2F216366-Vancouver-Coast.jpg%2F1698634403821?alt=media&token=dfbd5f5d-c4f9-4d68-89c4-f393f1383e18", type: "img" },
//         { file: "https://firebasestorage.googleapis.com/v0/b/freshpicks-da3ef.appspot.com/o/video%2Fcountdown_-_2637%20(540p).mp4%2F1698634405498?alt=media&token=f4e0bf52-8435-4759-b65c-4fca09068244", type: "video" },
//     ],
//     categories: ["1"],
//     vendors: [
//         {
//             name: "Sanjeev",
//             description: "ad",
//             categories: "1",
//             profileImg: "https://firebasestorage.googleapis.com/v0/b/freshpicks-da3ef.appspot.com/o/image%2F127.0.0.1_5500_html_Organizer_AddMarket.html_marketName%3D%26location%3D%26dateTime%3D%26image%3D%26video%3D%26description%3D%26question%3D%26answer%3D%20(1).png%2F1698634402405?alt=media&token=19e54475-da04-4140-9586-a8aa18f45d09",
//         },
//     ],
// };


const addGoogleMap = (latitude, longitude) => {
    const mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
    };
    const map = new google.maps.Map(document.getElementById('showMaps'), mapOptions);


    const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Market Location',
    });
};


function getDirections(lat, lng) {
    const directionUrl = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${lat},${lng}`;
    window.open(directionUrl, '_blank');
}


let marketDetailsData;


// Define the Market class
class Market {
    constructor(marketName, description, faq, media, categories, vendors, location) {
        this.marketName = marketName;
        this.description = description;
        this.faq = faq;
        this.media = media;
        this.categories = categories;
        this.vendors = vendors;
        this.location = location;
    }
}


// Function to retrieve market data from a specific document
const getMarketDetails = async () => {
    try {
        const docRef = doc(db, collectionName, documentId); // Replace with the actual document ID


        const docSnapshot = await getDoc(docRef);


        if (docSnapshot.exists()) {
            const marketData = docSnapshot.data();
            const marketName = marketData.marketName;
            const description = marketData.description;
            const faq = marketData.faq;
            const media = marketData.media;
            const categories = marketData.categories;
            const vendors = marketData.vendors;
            const location = marketData.location


            const market = new Market(marketName, description, faq, media, categories, vendors, location);
            marketDetailsData = market;
            console.log(marketDetailsData)
            return market;
         } else {
            console.log('Document does not exist');
        }
    } catch (error) {
        console.error('Error retrieving market data:', error);
    }
};


// Function to populate the page with market data
const populateMarketDetails = async(data) => {
    document.getElementById("marketName").textContent = data.marketName;
    document.getElementById("description").textContent = data.description;


    // Populate Images
    const imagesDiv = document.getElementById("images");
    data.media.forEach((media) => {
        if (media.type === "img") {
            const imgElement = document.createElement("img");
            imgElement.src = media.file;
            imagesDiv.appendChild(imgElement);
        }
    });


    // Populate FAQ
    const faqList = document.getElementById("faq");
    data.faq.forEach((faqItem) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${faqItem.question}:</strong> ${faqItem.answer}`;
        faqList.appendChild(listItem);
    });


    // Populate Food Categories
    const categoriesList = document.getElementById("categories");
    data.categories.forEach((category) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Category ${category}`;
        categoriesList.appendChild(listItem);
    });


    // Populate Vendors
    const vendorsList = document.getElementById("vendors");
    data.vendors.forEach((vendor) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${vendor.name}:</strong> ${vendor.description}`;
        vendorsList.appendChild(listItem);
    });


    addGoogleMap(data.location.lat, data.location.lng);


    const getDirectionsBtn = document.getElementById("getDirectionsBtn");
    getDirectionsBtn.addEventListener("click", () => {
        getDirections(data.location.lat, data.location.lng)
    })
}




function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}


loadGoogleMapsScript();


// Call the function to populate the page with data
getMarketDetails().then((data) => populateMarketDetails(data) );




