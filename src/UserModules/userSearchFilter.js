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
            filteredMarkets = filteredMarkets.filter(market => {
                const marketDistance = this.calculateDistance(
                    this.userLocation.lat,
                    this.userLocation.lng,
                    market.latitude,
                    market.longitude
                );
                return marketDistance <= this.filterDistance;
            });
        }
        console.log("after distance filter");
        console.log(filteredMarkets)

        if (this.filterCategory && this.filterCategory !== "") {
            // Filter based on category
            console.log("***************")
            filteredMarkets = filteredMarkets.filter((market) => {
                if (market.category && this.filterCategory) {
                  console.log("hellooo");
                  console.log(market.category.includes(this.filterCategory));
                  return true;
                } else {
                  return false;
                }
              });
              
        }

        console.log("after category filter");
        console.log(filteredMarkets)

        if (this.filterDate && this.filterDate !== "") {
            // Filter based on date
            filteredMarkets = filteredMarkets.filter(market => market.day && market.day.includes(this.filterDate));
        }

        console.log("after date filter");
        console.log(filteredMarkets)

        // Sort the filtered markets by distance in increasing order if distance filter is applied
        if (!isNaN(this.filterDistance)) {
            filteredMarkets.sort((a, b) => {
                const distanceA = this.calculateDistance(
                    this.userLocation.lat,
                    this.userLocation.lng,
                    a.latitude,
                    a.longitude
                );
                const distanceB = this.calculateDistance(
                    this.userLocation.lat,
                    this.userLocation.lng,
                    b.latitude,
                    b.longitude
                );
                return distanceA - distanceB;
            });
        }

        return filteredMarkets;
    }

}
