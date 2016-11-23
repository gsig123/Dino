$(document).ready(function() {
    $('.delete-offer').on('click', function() {
        var id = $(this).data('id');
        var url = '/users/delete' + id;

        if (confirm('Delete Offer?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result) {
                    console.log('Deleting Offer...');
                    window.location.href = '/users/admin';
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });

    var allDays = $('#allDays');
    var weekdays = $('.weekdays');
    allDays.click(function() {
    	console.log(allDays.is(':checked'));
    	if(!(allDays.is(':checked'))) {
    		allDays.removeAttr('checked');
            weekdays.each(function() {
                    $(this).removeAttr('checked');
            });
        } else {
        	allDays.prop('checked', true);
            weekdays.each(function() {
                    $(this).attr('checked', 'checked');
            });
        }
    });
});
