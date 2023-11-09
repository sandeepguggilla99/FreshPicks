// script.js


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import{getAuth} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getFirestore, doc, setDoc, updateDoc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
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

const populateReviewDetails = async() =>  {

    const marketDocRef = doc(db, collectionName, documentId);

    try {
        const marketDoc = await getDoc(marketDocRef);
        if (marketDoc.exists()) {
          const marketData = marketDoc.data();
          const reviews = marketData.reviews || [];
  
          const reviewCards = document.getElementById("reviewCards");
  
          if (reviews.length === 0) {
            // If no reviews, display a message
            const message = `
              <div class="alert alert-info" role="alert">
                No reviews available for this market.
              </div>
            `;
  
            reviewCards.innerHTML += message;
          } else {
            reviews.forEach((review) => {
              const card = `
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">${review.user}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Rating: ${review.rating}</h6>
                    <p class="card-text">${review.comment}</p>
                    <p class="card-text">${review.date.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
              `;
  
              reviewCards.innerHTML += card;
            });
          }
        } else {
          console.log("Market document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching review data: ", error);
      }

    };


document.getElementById("saveReview").addEventListener("click", async function () {
    const userName = document.getElementById("userName").value;
    const userComment = document.getElementById("userComment").value;
    const userRating = parseInt(document.getElementById("userRating").value);

    if (!userName || !userComment || isNaN(userRating) || userRating < 1 || userRating > 5) {
      alert("Please fill in all fields and provide a valid rating (1-5).");
      return;
    }

    const review = {
      user: userName,
      comment: userComment,
      rating: userRating,
      date: new Date(),
    };


    const marketDocRef = doc(db, collectionName, documentId);

    try {
      const marketDoc = await getDoc(marketDocRef);
      if (marketDoc.exists()) {
        const marketData = marketDoc.data();

        // Check if the "reviews" array exists, and create it if it doesn't
        if (!marketData.reviews) {
          marketData.reviews = [];
        }

        marketData.reviews.push(review);

        // Update the "market" document with the new reviews array
        await updateDoc(marketDocRef, { reviews: marketData.reviews });

        console.log("Review added:", review);

        // Close the modal
        let myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.hide();
      } else {
        console.log("Market document does not exist.");
      }
    } catch (error) {
      console.error("Error adding review: ", error);
    }


    // For demonstration, let's log the review data to the console.
    console.log("Review added:", review);

    // Close the modal
    let myModal = new bootstrap.Modal(document.getElementById("myModal"));
    myModal.hide();
  });



function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}


loadGoogleMapsScript();


// Call the function to populate the page with data
getMarketDetails().then((data) => populateMarketDetails(data).then(() => populateReviewDetails()) );


// JavaScript to fetch review data and populate the carousel
