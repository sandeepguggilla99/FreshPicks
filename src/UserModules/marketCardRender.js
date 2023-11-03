export function displayCards(filteredMarkets){

    console.log(filteredMarkets);

    const container = document.getElementById("cardsListing");
    container.innerHTML = "";



// Iterate through the array and generate HTML for each card
filteredMarkets.forEach(data => {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
 
  // Create and populate HTML elements to represent the data
const nameElement = document.createElement("h2");
nameElement.textContent = data.marketName;

const locationElement = document.createElement("p");
locationElement.textContent = `Location: ${data.marketLocation.name}`;

const dateElement = document.createElement("p");
dateElement.textContent = `Date: ${data.marketDate.date} ${data.marketDate.time}`;

const categoriesElement = document.createElement("p");
categoriesElement.textContent = `Categories: ${data.marketCategories.join(', ')}`;

// Create a "See Details" button
const seeDetailsButton = document.createElement("a");
seeDetailsButton.textContent = "See Details";
seeDetailsButton.classList.add("btn", "btn-primary"); // You can style this link as you like
seeDetailsButton.href = `/src/UserModules/MarketDetails/index.html?documentId=${data.marketID}`; // Replace 'your-details-page' with the actual URL of your details page

// Append the HTML elements to the card body
cardBody.appendChild(nameElement);
cardBody.appendChild(locationElement);
cardBody.appendChild(dateElement);
cardBody.appendChild(categoriesElement);
cardBody.appendChild(seeDetailsButton)


  card.appendChild(cardBody);
  container.appendChild(card);


  console.log("Fuck you 100 times Nanadan")
});


}// Assuming you have a container element to append the cards to, with an id "card-container"
