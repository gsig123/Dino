$(document).ready(function(){
	$('.delete-offer').on('click', function(){
		var id = $(this).data('id');
		var url = '/users/delete' + id;

		if(confirm('Delete Offer?')){
			$.ajax({
				url: url, 
				type: 'DELETE', 
				success: function(result){
					console.log('Deleting Offer...');
					window.location.href = '/users/admin';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});
});