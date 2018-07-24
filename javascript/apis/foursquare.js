class Venue { //TODO
  constructor() {
    //Unlimited calls
    this.id = null;
    this.title = null;
    this.type = null;
    //Premium calls (500/day)
    this.priceTier = null;
    this.closingTime = null;
    this.website = null;
    this.phoneNumber = null;
    this.rating = null;
    this.votes = null;
  }
}

const foursquare = {
  recommend: function() {
    $.ajax({
      dataType: "json",
      url: "https://api.foursquare.com/v2/venues/explore",
      data: {
        ll: `${userLocation.latitude},${userLocation.longitude}`,
        radius: 10000, //meters
        limit: 50, //results
        openNow: true,
        client_id: "JVNYUDCL0XHG00XHJPAIXW5G3GWPMCMWERUU2THM2KXHLSOG",
        client_secret: "4ZC4TTXFAZM5QVC1SS2MQLYTR50R0A2OAOVPLN1UR5GIHSQB",
        v: "20180718"
      }
    })
    .done(this.recommendationFetchSucceeded)
    .fail(this.recommendationFetchFailed);
  },
  recommendationFetchFailed: function(jqXHR, textStatus, errorThrown) {
    console.error("reccomend() failed.");
    console.log("jqXHR:", jqXHR);
    console.log("textStatus:", textStatus);
    console.log("errorThrown:", errorThrown);
  },
  recommendationFetchSucceeded: function(data, textStatus, jqXHR) {
    console.log("Foursquare API status: OK.");
    if ("warning" in data.response) {
      console.warn(`Foursquare API: "${data.response.warning.text}"`);
    }
    foursquare.fetchedVenues = data.response.groups[0].items.map(function(item) {
      let newVenue = new Venue();
      newVenue.id = item.venue.id;
      newVenue.title = item.venue.name;
      newVenue.type = item.venue.categories[0].name;
      return newVenue;
    });
    ui.renderVenues(foursquare.fetchedVenues);
  },
  fetchedVenues: [],

  getVenueDetails: function(venueID) {
    $.ajax({
      dataType: "json",
      url: `https://api.foursquare.com/v2/venues/${venueID}`,
      data: {
        client_id: "JVNYUDCL0XHG00XHJPAIXW5G3GWPMCMWERUU2THM2KXHLSOG",
        client_secret: "4ZC4TTXFAZM5QVC1SS2MQLYTR50R0A2OAOVPLN1UR5GIHSQB",
        v: "20180718"
      }
    })
    .done(this.venueDetailsFetchSucceeded)
    .fail(this.venueDetailsFetchFailed);
  },
  venueDetailsFetchFailed: function(jqXHR, textStatus, errorThrown) {
    console.error("getVenueDetails() failed.");
    console.log("jqXHR:", jqXHR);
    console.log("textStatus:", textStatus);
    console.log("errorThrown:", errorThrown);
  },
  venueDetailsFetchSucceeded: function(data, textStatus, jqXHR) {
    console.log(data);
  }
}