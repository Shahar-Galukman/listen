$(document).foundation();

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$('.call-to-vote').on('click', function(){
    $('#add-song-wrapper').fadeIn('fast');

    $(window).one('song.added', function(){
        $('.call-to-vote').fadeOut('fast');
    });
});