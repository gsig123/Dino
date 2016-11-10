var types = [];

// When document is ready, execute this code. 
$(document).ready(function() {

    // ====== DOM Elements ==========

    // Get the buttons for the types. 
    var typeButtons = $(".types");
    var priceSlider = $('#price-slider');
    var priceLowText = $('#price-slider-low');
    var priceHighText = $('#price-slider-high');

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
            console.log(types);
            removeTypeFromServer(this.value);
        } else {
            // If button has not been activated ->
            // Add the active class and 
            // Add instance to type array. 
            $(this).addClass("active");
            types.push(this.value);
            console.log(types);
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

    // ==============================

});

// Sends type added by POST request to server => Stored in session
var sendTypeToServer = function(type) {
    var url = '/addType' + type;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(type),
        url: url,
        success: function(data) {
            console.log('success');
            console.log(JSON.stringify(data));
        },
        error: {
            function(err) {
                console.log(err);
            }
        }
    });
}

// Removes type by POST request on server => Stored in session
var removeTypeFromServer = function(type) {
    var url = '/removeType' + type;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(type),
        url: url,
        success: function(data) {
            console.log('success');
            console.log(JSON.stringify(data));
        },
        error: {
            function(err) {
                console.log(err);
            }
        }
    });
}

// Updates price range by POST request on server => Stored in session
var updatePriceRangeOnServer = function(priceRangeString){
	var url = '/updatePriceRange' + priceRangeString;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(priceRangeString),
		url: url, 
		success: function(data){
			console.log('success');
			console.log(JSON.stringify(data));
		}, 
		error: {
			function(err){
				console.log(err);
			}
		}
	});
}
