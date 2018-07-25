const ui = {
  //State Variables
  $activeView: null,
  searchResultsScrollPosition: null,
  
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
  $view_venueDetail: $("#view-venue-details"),
  //TODO
  $button_returnToSearchResults: $("#button-back"),
  $text_venueCategory: $("#text-venue-category"),
  $text_venueName: $("#text-venue-name"),
  $text_venuePrice: $("#text-venue-price"),
  $text_venueClosingTime: $("#text-venue-closing-time"),
  $text_venueRating: $("#text-venue-rating"),
  $text_venueWebsite: $("#text-venue-website"),
  $text_venuePhoneNumber: $("#text-venue-phone-number"),
  $map: $("#map"),
  $text_venueTemperature: $("#text-venue-temperature"),
  $text_venuePrecipitation: $("#text-venue-precipitation"),
  $button_moreInfo: $("#button-more-info"),

  //UI Functions
  moveToSearchView: function() {
    this.$activeView.fadeOut(350, () => {
      this.$activeView = this.$view_search;
      this.$activeView.fadeIn(350);
      window.scroll(0, ui.searchResultsScrollPosition);
    });
  },
  moveToDetailsView: function() {
    ui.searchResultsScrollPosition = window.scrollY;
    console.log("Scroll position logged as: ", ui.searchResultsScrollPosition);
    this.$activeView.fadeOut(350, () => {
      this.$activeView = this.$view_venueDetail;
      window.scroll(0, 0);
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
    //Venue Details View state resets
    //TODO Polish system
    $("#wrapper-venue-price").show();

    ui.$text_venueCategory.html(venue.category);
    ui.$text_venueName.html(venue.name);
    venue.priceTier != null ? ui.$text_venuePrice.html(venue.priceTier) : $("#wrapper-venue-price").hide();
    ui.$text_venueClosingTime.html(venue.closingTime);
    ui.$text_venueRating.html(venue.rating + " from " + venue.votes + " ratings.");
    ui.$text_venueWebsite.html( venue.website.replace(/(http:\/\/www.)|(https:\/\/www.)|(http:\/\/)|(https:\/\/)/g, "") );
    ui.$text_venuePhoneNumber.html(venue.phoneNumber);
    ui.searchResultsScrollPosition = window.scrollY;
    ui.moveToDetailsView();
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
    ui.moveToSearchView();
  });

  //Search View, Geolocate User button
  ui.$button_geolocateUser.on("click", function() {
    userLocation.nativelyGeolocate();
  });
  
  //Search View, Submit Search button
  ui.$button_submitSearch.on("click", function() {
    ui.submitButtonClicked();
  });

  //Venue Details View, Back button
  ui.$button_returnToSearchResults.on("click", function() {
    ui.moveToSearchView( ui.$view_search );
  });
}