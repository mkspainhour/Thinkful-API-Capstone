const ui = {
  //State Variables
  $activeView: null,
  //Welcome View Component Pointers
  $view_welcome: $("#view-welcome"),
  $button_letsGetStarted: $("#button-lets-get-started"),
  //Search View Component Pointers
  $view_search: $("#view-search"),
  $button_geolocateUser: $("#button-geolocate-user"),
  $field_search: $("#field-search"),
  $button_submitSearch: $("#button-submit-search"),
  $wrapper_searchResults: $("#search-results-wrapper"),

  moveToView: function($newView) {
    this.$activeView.fadeOut(350, () => {
      this.$activeView = $newView;
      this.$activeView.fadeIn(350);
    });
  },

  setSearchText: function(newText) {
    this.$field_search.val(newText);
  },

  renderVenues: function(venues) {
    let constructedElements = [];
    for(let currentIndex = 0; currentIndex <  venues.length; currentIndex++) {
      let currentVenueElement = 
      `<div class="search-result card">
        <p class="typography-overline left-align light">${venues[currentIndex].type}</p>
        <p class="typography-compact left-align light">${venues[currentIndex].title}</p>
        <img src="resources/icons/chevron.svg" class="svg-search-result-chevron" alt="More venue detail...">
      </div>`;
      constructedElements.push(currentVenueElement);
    }
    this.$wrapper_searchResults.html(constructedElements);
  },
};