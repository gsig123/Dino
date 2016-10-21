$(document).ready(function(){

	var priceSlider = $('#price-slider');
	var priceLowText = $('#price-slider-low');
	var priceHighText = $('#price-slider-high');

	// Add Bootstrap price slider to index
	priceSlider.slider({});

	// Catch price slide event
	priceSlider.on('slide', function(){
		var low = priceSlider.data('slider').value[0];
		var high = priceSlider.data('slider').value[1]
		// Change text
		priceLowText.html(low + " kr");
		priceHighText.html(high + " kr");
	});

	// Check if type buttons are checked. 
	// If they are checked we remove the active class.
	// If they are not checked we add the active class.
	$('.type-group > .btn').on("click", function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		}else{
			$(this).addClass("active");
		}
	});
});
