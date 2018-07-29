class Venue { //TODO
  constructor() {
    //Unlimited calls
    this.id = null;
    this.name = null;
    this.type = null;
    this.foursquareURL = null;
    this.latitude = null;
    this.longitude = null;
    this.address = [];
    //Premium calls (500/day)
    this.price = null;
    this.hours = null;
    this.website = null;
    this.phoneNumber = null;
    this.rating = null;
    this.votes = null;
  }
}

const foursquareAPI = {
  previousFetchCoordinates: {
    latitude: null,
    longitude: null
  },
  fetchedVenues: [],
  fetchRecommendationsAround: function (latitude, longitude) {
    if (this.previousFetchCoordinates.latitude != latitude && this.previousFetchCoordinates.longitude != longitude) {
      this.previousFetchCoordinates.latitude = latitude;
      this.previousFetchCoordinates.longitude = longitude;
      $.ajax({
        dataType: "json",
        url: "https://api.foursquare.com/v2/venues/explore",
        data: {
          ll: `${latitude},${longitude}`,
          radius: 10000, //meters
          limit: 30, //results
          openNow: true,
          client_id: "JVNYUDCL0XHG00XHJPAIXW5G3GWPMCMWERUU2THM2KXHLSOG",
          client_secret: "4ZC4TTXFAZM5QVC1SS2MQLYTR50R0A2OAOVPLN1UR5GIHSQB",
          v: "20180718"
        }
      })
      .done(this.recommendationFetchSucceeded)
      .fail(this.recommendationFetchFailed);
    }
    else {
      console.warn("Duplicate foursquareAPI.fetchRecommendationsAround(latitude, longitude) call circumvented.");
      ui.disableGeolocatingIcon();
    }
  },
  recommendationFetchFailed: function (jqXHR) {
    let errorCode = jqXHR.responseJSON.meta.code;
    switch (errorCode) {
      case 400:
        alert("foursquareAPI.getRecommendationsAround(latitude, longitude) failed due to a malformed or missing $.ajax() call parameter.")
        break;
      case 500:
        alert("foursquareAPI.getRecommendationsAround(latitude, longitude) failed due to an internal Foursquare server error.");
        break;
    };
  },
  recommendationFetchSucceeded: function (data) {
    console.log(`foursquareAPI.fetchRecommendationsAround(latitude, longitude) succeeded!`);
    if ("warning" in data.response) {
      console.warn(`However, there was a warning included: "${data.response.warning.text}"`);
      ui.setSearchMessage("Couldn't find anything with that. I work best if you give me the name of a city.");
    }

    foursquareAPI.fetchedVenues = data.response.groups[0].items.map(function (item) {
      let newVenue = new Venue();
      newVenue.id = item.venue.id;
      newVenue.name = item.venue.name;
      newVenue.category = item.venue.categories[0].name;
      newVenue.latitude = item.venue.location.lat;
      newVenue.longitude = item.venue.location.lng;
      newVenue.address[0] = item.venue.location.formattedAddress[0];
      newVenue.address[1] = item.venue.location.formattedAddress[1];
      return newVenue;
    });
    ui.enableClearSearchTextButton();
    ui.enableSearchFormInput();
    ui.$button_geolocateUser.prop("disabled", false);
    ui.renderVenues(foursquareAPI.fetchedVenues);
  },

  alreadyDetailedVenueIDs: [],
  getVenueDetails: function (venue) {
    if(this.alreadyDetailedVenueIDs.includes(venue.id) == false) {
      this.alreadyDetailedVenueIDs.push(venue.id);
      $.ajax({
        dataType: "json",
        url: `https://api.foursquare.com/v2/venues/${venue.id}`,
        data: {
          client_id: "JVNYUDCL0XHG00XHJPAIXW5G3GWPMCMWERUU2THM2KXHLSOG",
          client_secret: "4ZC4TTXFAZM5QVC1SS2MQLYTR50R0A2OAOVPLN1UR5GIHSQB",
          v: "20180718"
        },
        //The index of the Venue object in the foursquareAPI.fetchedVenues array that is receiving details
        venueTargetIndex: foursquareAPI.fetchedVenues.indexOf(venue)
        //Passed through here so that the venueDetailsFetchSucceeded() method can utilize it
      })
      .then(this.venueDetailsFetchSucceeded)
      .catch(this.venueDetailsFetchFailed);
    }
    else {
      console.warn("Duplicate foursquareAPI.getVenueDetails(venue) call circumvented.");
      ui.showVenueDetailsFor(venue);
    }
  },
  venueDetailsFetchFailed: function (jqXHR) {
    let errorCode = jqXHR.responseJSON.meta.code;
    switch (errorCode) {
      case 400:
        alert("foursquareAPI.getVenueDetails(venue) failed due to a malformed or missing $.ajax() call parameter.")
        break;
      case 404:
        alert("Invalid venue passed to foursquareAPI.getVenueDetails(venue).");
        break;
      case 500:
        alert("foursquareAPI.getVenueDetails(venue) failed due to an internal Foursquare server error.");
        break;
    };
  },
  venueDetailsFetchSucceeded: function (data) {
    console.log("foursquareAPI.getVenueDetails(venue) succeeded!");
    let fetchedVenueDetails = data.response.venue;

    if ("price" in fetchedVenueDetails) {
      foursquareAPI.fetchedVenues[this.venueTargetIndex].price = "$".repeat(fetchedVenueDetails.price.tier);
    }
    if ("hours" in fetchedVenueDetails) {
      foursquareAPI.fetchedVenues[this.venueTargetIndex].hours = fetchedVenueDetails.hours.status;
    }
    if ("url" in fetchedVenueDetails) {
      foursquareAPI.fetchedVenues[this.venueTargetIndex].website = fetchedVenueDetails.url;
    }
    if ("contact" in fetchedVenueDetails) {
      foursquareAPI.fetchedVenues[this.venueTargetIndex].phoneNumber = fetchedVenueDetails.contact.formattedPhone;
    }
    if ("rating" in fetchedVenueDetails) {
      foursquareAPI.fetchedVenues[this.venueTargetIndex].rating = fetchedVenueDetails.rating;
    }
    if ("ratingSignals" in fetchedVenueDetails) {
      foursquareAPI.fetchedVenues[this.venueTargetIndex].votes = fetchedVenueDetails.ratingSignals;
    }
    if ("canonicalUrl" in fetchedVenueDetails) {
      foursquareAPI.fetchedVenues[this.venueTargetIndex].foursquareURL = fetchedVenueDetails.canonicalUrl;
    }
    ui.showVenueDetailsFor(foursquareAPI.fetchedVenues[this.venueTargetIndex]);
  }
}