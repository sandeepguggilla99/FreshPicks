export class filterMarketData {
    constructor(marketDataArray, userLocation, filterCategory, filterDistance, filterDate) {
        this.marketDataArray = marketDataArray;
        this.userLocation = userLocation;
        this.filterDistance = filterDistance;
        this.filterCategory = filterCategory;
        this.filterDate = filterDate;
        console.log("This file filters");
        console.log(this.marketDataArray, this.userLocation, this.filterDistance, this.filterCategory, this.filterDate);
        console.log("the end")
    }




    calculateDistance(lat1, lon1, lat2, lon2) {
        console.log("This is lat2 and lon2");
        console.log(lat2, lon2)
        console.log("Calculating distance...");
        console.log(lat1, lon1, lat2, lon2);
        const earthRadius = 6371;


        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;


        const lonDiff = Math.abs(lon1 - lon2);


        const radLonDiff = Math.PI * lonDiff / 180;


        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radLonDiff);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;


        console.log("this is calculated distance..........");
        console.log(dist)
        return dist;
    }




    filterMarketsByCategory() {
        let filteredMarkets = [];


        // First, populate filteredMarkets with all markets
        // (Assuming you have an array of markets, e.g., this.allMarkets)
        filteredMarkets = this.marketDataArray;


        if (!isNaN(this.filterDistance)) {
            // Filter based on distance
            filteredMarkets = this.marketDataArray.filter(market => {
                console.log("**** This is inside filtered markets");
                console.log("This is market array");
                console.log(market);
                console.log("This is market location");
                console.log(market.marketLocation.lat);
                const marketDistance = this.calculateDistance(
                    this.userLocation.lat,
                    this.userLocation.lng,
                    market.marketLocation.lat,
                    market.marketLocation.lng
                );
                return marketDistance <= this.filterDistance;
            });
        }
        console.log("after distance filter");
        console.log(filteredMarkets);


        console.log("this is filtered category");
        console.log(this.filterCategory);


        if (Array.isArray(this.filterCategory) && this.filterCategory.length > 0) {
            // Filter based on category
            console.log("*****");
            filteredMarkets = filteredMarkets.filter((market) => {
              if (Array.isArray(market.marketCategories) && market.marketCategories.length > 0) {
                console.log("hellooo");
                return this.filterCategory.every((filterItem) => market.marketCategories.includes(filterItem));
              } else {
                return false;
              }
            });
          }


        console.log("after category filter");
        console.log(filteredMarkets)


        if (this.filterDate && this.filterDate !== "" && filteredMarkets.length > 0) {
            // Convert the filterDate and today's date to Date objects
            const parseSelectedDate = new Date(this.filterDate);
            let selectedDate = moment(parseSelectedDate).format('DD/MM/YYYY');
            
            const parsetoday = new Date();
            let today = moment(parsetoday).format('DD/MM/YYYY');

            console.log("TODAYSSSS DATTEEE and SELECTED DATEEE");
            console.log(selectedDate, today)
        
            // Check if the selected date is in the past
            if (selectedDate > today) {
                // If the selected date is not in the past, filter the markets
                filteredMarkets = filteredMarkets.filter(market => {
                    // Compare market date with the selected date
                    if (market.marketDate.date === this.filterDate) {
                        return true; // Keep the date in filteredMarkets
                    } else {
                        return false; // Exclude the date from filteredMarkets
                    }
                });
            } else {
                // The selected date is in the past, so return false
                filteredMarkets = [];
                // return false;
            }
        }
       


        console.log("after date filter");
        console.log(filteredMarkets)


        // Sort the filtered markets by distance in increasing order if distance filter is applied
        if (!isNaN(this.filterDistance) && filteredMarkets.length > 0) {
            filteredMarkets.sort((a, b) => {
                const distanceA = this.calculateDistance(
                    this.userLocation.lat,
                    this.userLocation.lng,
                    a.marketLocation.lat,
                    a.marketLocation.lng
                );
                const distanceB = this.calculateDistance(
                    this.userLocation.lat,
                    this.userLocation.lng,
                    b.marketLocation.lat,
                    b.marketLocation.lng
                );
                return distanceA - distanceB;
            });
        }


        return filteredMarkets;
    }


}