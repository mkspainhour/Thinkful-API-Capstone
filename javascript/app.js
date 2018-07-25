const ui = {
  //State Variables
  $activeView: null,
  
  //Welcome View component pointers
  $view_welcome: $("#view-welcome"),
  $button_letsGetStarted: $("#button-lets-get-started"),
  
  //Search View component pointers
  $view_search: $("#view-search"),
  $button_geolocateUser: $("#button-geolocate-user"),
  $field_search: $("#field-search"),
  $button_submitSearch: $("#button-submit-search"),
  $wrapper_searchResults: $("#search-results-wrapper"),

  //Venue Detail View component pointers
  $view_venueDetail: $("#view-venue-detail"),
  //TODO
  //$button_returnToSearchResults,
  //$text_venueCategory,
  //$text_venueName,
  //$text_venuePrice,
  //$text_venueClosingTime,
  //$text_venueRating,
  //$text_venueWebsite,
  //$text_venuePhoneNumber,
  //$map,
  //$text_venueTemperature,
  //$text_venuePrecipitation,
  $button_moreInfo: $("#button-more-info"),

  //UI Functions
  moveToView: function($newView) {
    this.$activeView.fadeOut(350, () => {
      this.$activeView = $newView;
      this.$activeView.fadeIn(350);
    });
  },
  submitButtonClicked: function() {
    let searchTerms = this.$field_search.val();
    //The search terms must include at least a character or digit
    if (searchTerms.length > 0 && searchTerms.match(/[\w\d]/g)) {
      googleMapsAPI.geocode( searchTerms );
    }
    else {
      alert("Not a valid search. Must contain at least a letter or number.");
    }
  },
  setSearchText: function(newText) {
    this.$field_search.val(newText);
  },
  renderVenues: function() {
    let constructedVenueElements = [];
    for(let i = 0; i <  foursquareAPI.fetchedVenues.length; i++) {
      let currentVenueElement = 
      `<div id="${i}" class="search-result card">
        <p class="typography-overline left-align light">${foursquareAPI.fetchedVenues[i].category}</p>
        <p class="typography-compact left-align light">${foursquareAPI.fetchedVenues[i].name}</p>
        <img src="resources/icons/chevron.svg" class="svg-search-result-chevron" alt="More venue detail...">
      </div>`;
      constructedVenueElements.push(currentVenueElement);
    }
    this.$wrapper_searchResults.html(constructedVenueElements);
    this.configureSearchResultEventListeners();
  },
  configureSearchResultEventListeners: function() {
    $(".search-result").on("click", function(event) {
      searchResultIndex = event.currentTarget.id;
      clickedVenue = foursquareAPI.fetchedVenues[searchResultIndex];
      foursquareAPI.getVenueDetails(clickedVenue);
    })
  },
  showVenueDetailsFor: function(venue) {

  }
};

const userLocation = {
  latitude: null,
  longitude: null,
  googlePlaceID: null,
  formattedAddress: null,
  setCoordinates: function(newLatitude, newLongitude) {
    this.latitude = newLatitude;
    this.longitude = newLongitude;
  },
  nativelyGeolocate: function() {
    ui.setSearchText("Locating...");
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        userLocation.setCoordinates( position.coords.latitude, position.coords.longitude );
        googleMapsAPI.geocode( userLocation.latitude.toString() + "," + userLocation.longitude.toString() );
      },
      function failure(PositionError) {
        ui.setSearchText("Geolocation prevented.");
        console.error("Native geolocation: " + PositionError.message);
      },
      { //Position Options
        timeout: 10000, //10 seconds
        maximumAge: 60000 //1 minute
      }
    );
  }
};





//Entry Point Function
$(function entryPoint() {
  startup();
  configureInitialEventListeners();
});

function startup() {
  if (sessionFlags.deviceHasNativeGeolocation == false) {
    console.warn("User can not geolocate natively. Hiding button.");
    ui.$button_geolocateUser.hide();
  }
  ui.$activeView = ui.$view_welcome;
}

function configureInitialEventListeners() {
  //Welcome View, Let's Get Started button
  ui.$button_letsGetStarted.on("click", function() {
    ui.moveToView( ui.$view_search );
  });

  //Search View, Geolocate User button
  ui.$button_geolocateUser.on("click", function() {
    userLocation.nativelyGeolocate();
  });
  
  //Search View, Submit Search button
  ui.$button_submitSearch.on("click", function() {
    ui.submitButtonClicked();
  });
}