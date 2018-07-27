nationalWeatherServiceAPI = {
  getVenueTemperature: function (venue) {
    $.ajax({
        dataType: "json",
        url: `https://api.weather.gov/points/${venue.latitude},${venue.longitude}/forecast/hourly`,
        //The index of the Venue object in the foursquareAPI.fetchedVenues array that is receiving temperature data
        venueTargetIndex: foursquareAPI.fetchedVenues.indexOf(venue)
        //Passed through here so that the getVenueTemperatureSucceeded() method can utilize it
      })
      .then(this.getVenueTemperatureSucceeded)
      .catch(this.getVenueTemperatureFailed);
  },
  getVenueTemperatureFailed: function (jqXHR) {
    switch (jqXHR.status) {
      case 404:
        console.error("No temperature to fetch for provided latitude and longitude.");
        console.warn("Note: service does not function outside of the United States.");
        break;
    }
  },
  getVenueTemperatureSucceeded: function (data) {
    console.log("nationalWeatherServiceAPI.getTemperature(latitude, longitude) succeeded!");
    foursquareAPI.fetchedVenues[this.venueTargetIndex].temperature = data.properties.periods[0].temperature;
    ui.$text_venueTemperature.html(data.properties.periods[0].temperature);
  }
};