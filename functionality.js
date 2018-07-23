const flags = {
  userDeviceHasNativeGeolocation: ("geolocation" in window.navigator)
}

const userLocation = {
  latitude: null,
  longitude: null,
  googlePlaceID: null,
  setCoordinates: function(newLatitude, newLongitude) {
    this.latitude = newLatitude;
    this.longitude = newLongitude;
  }
};



class Venue { //TODO
  constructor() {
    //Free
    this.id = null;
    this.title = null;
    this.type = null;
    //Premium (500/day)
    this.priceTier = null;
    this.closingTime = null;
    this.website = null;
    this.phoneNumber = null;
    this.rating = null;
    this.votes = null;
  }
}

const ui = {
  $activeView: null,

  moveToView: function($newView) {
    this.$activeView.fadeOut(350, () => {
      this.$activeView = $newView;
      this.$activeView.fadeIn(350);
    });
  },

  setSearchText: function(newText) {
    this.$field_locationSearch.val(newText);
  },

  renderVenues: function() {
    let venueElementCollection = [];
    for(let i = 0; i <  foursquare.fetchedVenues.length; i++) {
      let venueElement = 
      `<div class="search-result card">
        <p class="typography-overline left-align light">${foursquare.fetchedVenues[i].type}</p>
        <p class="typography-compact left-align light">${foursquare.fetchedVenues[i].title}</p>
        <img src="icons/chevron.svg" class="svg-search-result-chevron" alt="More venue detail...">
      </div>`;
      venueElementCollection.push(venueElement);
    }
    this.$wrapper_searchResults.html(venueElementCollection);
  },

  $view_welcome: $("#view-welcome"),
    $button_letsGetStarted: $("#button-lets-get-started"),
  $view_search: $("#view-search"),
    $button_geolocateUser: $("#button-geolocate-user"),
    $field_locationSearch: $("#field-search"),
    $button_submitLocationQuery: $("#button-submit-search"),
    $wrapper_searchResults: $("#search-results-wrapper")
};

googleGeocoding = {
  geocoder: new google.maps.Geocoder(),
  convert: function(queryToConvert) {
    this.conversionFetch(queryToConvert)
    .then(this.conversionFetchSucceeded)
    .catch(this.conversionFetchFailed);
  },
  conversionFetch: function(queryToConvert) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({"address": queryToConvert}, function(results, status) {
        status === "OK" ? resolve(results) : reject(status);
      });
    });
  },
  conversionFetchFailed: function(status) {
    console.error(`Google Geocoding API status: ${status}.`);
  },
  conversionFetchSucceeded: function(results) {
    console.log("Google Geocoding API status: OK.");
    userLocation.setCoordinates(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    userLocation.googlePlaceID = results[0].place_id;
    userLocation.googleFormattedAddress = results[0].formatted_address;
    foursquare.recommend();
    ui.setSearchText(userLocation.googleFormattedAddress);
  },
};

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
    ui.renderVenues();
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

googleMaps = { //TODO
  $wrapper: ui.$wrapper_map,
  options: {
    //TODO
  },
  setCenter: function(newLatitude, newLongitude) {
    //TODO
  },
  setZoom: function(newZoom) {
    //TODO
  },
  setMarker: function(latitude, longitude) {
    //TODO
  },
  activeMarker: null,
  removeMarker: function() {
    //TODO
  },
};



//Entry Point Function
$(function entryPoint() {
  startup();
  configureEventListeners();
});

function startup() {
  if (!flags.userDeviceHasNativeGeolocation) {
    console.warn("User can not geolocate natively.");
  }
  ui.$activeView = ui.$view_welcome;
  if(!flags.userDeviceHasNativeGeolocation) {
    ui.$button_geolocateUser.hide();
  }
}

function configureEventListeners() {

  ui.$button_letsGetStarted.on("click", function() {
    ui.moveToView(ui.$view_search);
    ui.$field_locationSearch.focus();
  });

  ui.$button_geolocateUser.on("click", () => {
    ui.setSearchText("Locating...");
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        userLocation.setCoordinates(position.coords.latitude, position.coords.longitude);
        googleGeocoding.convert(userLocation.latitude.toString() + "," + userLocation.longitude.toString())
      },
      function failure(PositionError) {
        alert("Denied: " + PositionError.message);
        ui.setSearchText("Could not locate.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });

  ui.$button_submitLocationQuery.on("click", () => {
    console.log(ui.$field_locationSearch.val());
    if (ui.$field_locationSearch.val() != "") {
      googleGeocoding.convert( ui.$field_locationSearch.val() );
    }
  });
}