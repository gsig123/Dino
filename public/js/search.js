var types = [];

// When document is ready, execute this code. 
$(document).ready(function() {

    // ====== DOM Elements ==========

    // Get the buttons for the types. 
    var typeButtons = $(".types");
    var priceSlider = $('#price-slider');
    var priceLowText = $('#price-slider-low');
    var priceHighText = $('#price-slider-high');
    var searchBar = $('#searchBar');
    var sortBy = $('.sortBy');
    var ordering = $('.ordering');

    // Set the active sorting option to be selected. 
    sortBy.each(function(){
        if($(this).hasClass("checked")) $(this).attr("checked", "checked");
    });
    // Set the active ordering option to be selected. 
    ordering.each(function(){
        if($(this).hasClass("checked")) $(this).attr("checked", "checked");
    });


    // ==============================

    // Init slider
    priceSlider.slider({});

    // ====== Event Handlers ========

    // Event handler for click on type buttons. 
    typeButtons.click(function() {
        // If button has been activated -> 
        // Remove the active class and 
        // Remove instance from type array.
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            types.splice(types.indexOf(this.value), 1);
            removeTypeFromServer(this.value);
        } else {
            // If button has not been activated ->
            // Add the active class and 
            // Add instance to type array. 
            $(this).addClass("active");
            types.push(this.value);
            sendTypeToServer(this.value);
        }
    });

    // Handler for slide on priceSlider
    priceSlider.on('slide', function() {
        var low = priceSlider.data('slider').value[0];
        var high = priceSlider.data('slider').value[1];

        // Change text
        priceLowText.html(low + " kr");
        priceHighText.html(high + " kr");

        var priceRangeString = "" + low + "," + high;

        updatePriceRangeOnServer(priceRangeString);
    });

    // Handler for input in search bar.
    searchBar.keyup(function(){
    	var searchString = this.value;
    	
    	updateSearchBarOnServer(searchString);
    });


    sortBy.change(function(){
        var name = $(this).attr('id');
        updateSortByOnServer(name);
    });

    ordering.change(function(){
        var name = $(this).attr('id');
        updateOrderingOnServer(name);
    });

    // ==============================

});

// Sends type added by POST request to server => Stored in session
var sendTypeToServer = function(type) {
    var url = '/addType' + type;
    $.ajax({
        type: 'POST',
        data: "{}", 
        dataType: "json", 
        url: url, 
        success: function(data){
            console.log("Success posting new type to server!");
        }, 
        error: function(data){
            console.log("Error posting new type to server!");
        }
    });
}

// Removes type by POST request on server => Stored in session
var removeTypeFromServer = function(type) {
    var url = '/removeType' + type;
    $.ajax({
        type: 'POST',
        url: url
    });
}

// Updates price range by POST request on server => Stored in session
var updatePriceRangeOnServer = function(priceRangeString){
	var url = '/updatePriceRange' + priceRangeString;
	$.ajax({
		type: 'POST',
		url: url
	});
}

// Update price range by POST request on server => Stored in session
var updateSearchBarOnServer = function(searchString){
	console.log(searchString);
	var url = '/updateSearchBar' + searchString;
	$.ajax({
		type: 'POST',
		url: url
	});
}

// Update sortBy by POST request on server => Stored in session. 
var updateSortByOnServer = function(name){
    var url = '/updateSortBy' + name;
    $.ajax({
        type: 'POST', 
        url: url
    });
}

var updateOrderingOnServer = function(name){
    var url = '/updateOrdering' + name;
    $.ajax({
        type: 'POST',
        url: url
    });
}