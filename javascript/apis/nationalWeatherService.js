nationalWeatherService = {
  getVenueTemperature: function(venue) {
    if (!venue.temperature) {
      $.ajax({
          dataType: "json",
          url: `https://api.weather.gov/points/${venue.latitude},${venue.longitude}/forecast/hourly`,
          //The index of the Venue object in the foursquare.fetchedVenues array that is receiving temperature data
          venueTargetIndex: foursquare.fetchedVenues.indexOf(venue)
          //Passed through here so that the getVenueTemperatureSucceeded() method can utilize it
        })
        .then(this.getVenueTemperatureSucceeded)
        .catch(this.getVenueTemperatureFailed);
    }
    else {
      console.log("Duplicate nationalWeatherService.getVenueTemperature(venue) call circumvented.");
    }
  },
  getVenueTemperatureFailed: function(jqXHR) {
    ui.$text_venueTemperature.html("Temperature data not available.");
    switch (jqXHR.status) {
      case 404:
        console.error("No temperature to fetch for provided latitude and longitude.");
        console.warn("Note: service does not function outside of the United States.");
        break;
    }
  },
  getVenueTemperatureSucceeded: function(data) {
    console.log("nationalWeatherService.getTemperature(latitude, longitude) succeeded!");
    foursquare.fetchedVenues[this.venueTargetIndex].temperature = data.properties.periods[0].temperature;
    ui.$text_venueTemperature.html(data.properties.periods[0].temperature + " ℉");
  }
};