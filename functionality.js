
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
    return {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
};

class Attraction { //TODO
  constructor() {
    this.name = null;
  }
}

const ui = {
  initialize: function() {
    this.moveToView(this.components.$view_welcome);
  },
  $activeView: null,
  moveToView: function($newView) {
    this.$activeView.fadeOut(350, () => {
      this.$activeView = $newView;
      this.$activeView.fadeIn(350);
    });
  },
  setSearchText: function(newText) {
    this.components.$field_locationQuery.val(newText);
  },
  renderAttractions: function() {
    //TODO
  },
  components: {
    $view_welcome: $("#view-welcome"),
      $button_letsGetStarted: $("#button-lets-get-started"),
    $view_search: $("#view-search"),
      $button_geolocateUser: $("#button-geolocate-user"),
      $field_locationQuery: $("#field-location-query"),
      $button_submitLocationQuery:  $("#button-submit-location-query"),
    $view_attractionDetail: $("#view-attraction-detail"), //TODO
      // $wrapper_map: null, //TODO
      // $wrapper_attractionDetailText: null, //TODOt
      // $button_moreInfoOnFoursquare: null //TODO
  }
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
    googleGeocoding.networkResponseCache = results[0];
    userLocation.setCoordinates(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    userLocation.googlePlaceID = results[0].place_id;
    userLocation.googleFormattedAddress = results[0].formatted_address;
    foursquare.recommend();
    ui.setSearchText(userLocation.googleFormattedAddress);
    console.log(userLocation);
  },
  networkResponseCache: null
};

const foursquare = {
  recommend: function() {
    console.log(userLocation.latitude, userLocation.longitude);
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
    console.log("Failure!");
    console.log("jqXHR:", jqXHR);
    console.log("textStatus:", textStatus);
    console.log("errorThrown:", errorThrown);
  },
  recommendationFetchSucceeded: function(data, textStatus, jqXHR) {
    console.log("Foursquare API status: OK.");
    if ("warning" in data.response) {
      console.warn(`Foursquare API: "${data.response.warning.text}"`);
    }
    foursquare.networkResponseCache = data;
    foursquare.fetchedAttractions = data.response.groups[0].items.map(function(item) {
      return item.venue;
    });
    console.log(foursquare.fetchedAttractions);
  },
  fetchedAttractions: [],
  networkResponseCache: null
}

googleMaps = { //TODO
  $wrapper: ui.components.$wrapper_map,
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
  ui.$activeView = ui.components.$view_welcome;
}

function configureEventListeners() {

  ui.components.$button_letsGetStarted.on("click", function() {
    ui.moveToView(ui.components.$view_search);
    ui.components.$field_locationQuery.focus();
  });

  if (flags.userDeviceHasNativeGeolocation) {
    ui.components.$button_geolocateUser.on("click", () => {
      navigator.geolocation.getCurrentPosition(function(position) {
        userLocation.setCoordinates(position.coords.latitude, position.coords.longitude);
        googleGeocoding.convert(userLocation.latitude.toString() + "," + userLocation.longitude.toString())
      });
    });
  }

  ui.components.$button_submitLocationQuery.on("click", () => {
    if (ui.components.$field_locationQuery.val() != "") {
      googleGeocoding.convert( ui.components.$field_locationQuery.val() );
    }
  });

}